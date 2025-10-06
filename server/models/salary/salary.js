import { ObjectId } from "mongodb";
import { create, getOne, createMany, updateMany, aggregate, aggregationWithPegination } from "../../helper/mongo.js";
import { logger } from '../../helper/logger.js';
import { defaultSalaryComponents } from "../../helper/constants.js";

const salaryComponentsCollection = "salaryComponents";
const salaryTemplatesCollection = "salaryTemplates";

export const createDefaultSalaryComponents = async (body) => {
  try {
    const orgId = body.user?.orgId;
    const components = defaultSalaryComponents.map((comp) => {
      const base = {
        name: comp.name,
        category: comp.category,
        orgId,
        isActive: true,
        isStatutory: comp.isStatutory || false,
        createdDate: new Date(),
      };

      if (comp.isStatutory && comp.statutoryDetails) {
        base.statutoryDetails = comp.statutoryDetails;
      }

      return base;
    });

    return createMany(components, salaryComponentsCollection);
  } catch (error) {
    logger.error("Error while creating default salary components in salary model");
    throw error;
  }
};


export const listSalaryComponents = async (body) => {
  try {
    if (!body.orgDetails?._id) {
      throw new Error("orgId is required");
    }

    const params = {
      orgId: new ObjectId(body.orgDetails._id),
    };

    if (body.category && body.category !== "all") {
      if (body.category === "statutory") {
        params.isStatutory = true;
      } else if (body.category === "normal") {
        params.isStatutory = false;
      }
    }

    if (typeof body.isActive === "boolean") {
      params.isActive = body.isActive;
    }

    const aggregationPipeline = [{ $match: params }];

    const paginationQuery = {
      page: body.page,
      limit: body.limit,
      sortOrder: 1,
      sortBy: "_id",
    };

    return await aggregationWithPegination(
      aggregationPipeline,
      paginationQuery,
      salaryComponentsCollection
    );
  } catch (error) {
    logger.error("Error while listSalaryComponents", error);
    throw error;
  }
};


export const createSalaryComponent = async (body) => {
  try {
    // console.log(body)
    const name = body.name.trim().toLowerCase();
    const category = body.category;
    const isStatutory = body.statutory ?? false;
    const createdBy = new ObjectId(body.userId);
    const createdDate = new Date();
    const isActive = true;
    const orgId = new ObjectId(body.orgDetails._id);

    const query = {
        $or: [
            { name, orgId: { $exists: false } },
            { name, orgId }
        ]
    }

    const { status: existing } = await getOne(query, salaryComponentsCollection);

    if (existing) {
        return {
            status: false,
            message: `Salary component "${name}" already exists.`,
        }
    }

    const salaryComponentObj = {
      name,
      category,
      isStatutory,
      isActive,
      createdBy,
      createdDate,
      orgId
    };

    const result = await create(salaryComponentObj, salaryComponentsCollection);

    return {
      status: true,
      data: result,
    };
  } catch (error) {
    logger.error("Error while creating salary component", error);
    throw error;
  }
};

export const updateSalaryComponent = async (body) => {
  try {
    const { componentId, orgDetails, ...updateFields } = body;
    if (!componentId) throw new Error("componentId is required");
    if (!orgDetails?._id) throw new Error("orgId is required");

    const orgId = new ObjectId(orgDetails._id);
    const filter = { _id: new ObjectId(componentId), orgId };

    // Only allow updatable fields
    const allowed = ["name", "category", "isStatutory", "statutoryDetails", "isActive"];
    const update = {};
    for (const key of allowed) {
      if (updateFields[key] !== undefined) update[key] = updateFields[key];
    }
    if (update.name) update.name = update.name.trim().toLowerCase();

    const result = await updateMany(filter, { $set: update }, salaryComponentsCollection);
    return {
      status: true,
      message: "Salary component updated successfully",
      data: result,
    };
  } catch (error) {
    logger.error("Error while updating salary component", error);
    throw error;
  }
};

export const createSalaryTemplate = async (body) => {
    console.log(body)
  try {
    if (!body.orgDetails?._id) {
      throw new Error("orgId is required");
    }

    if (!body.templateName || !body.description) {
      throw new Error("Template name and description are required");
    }

    const orgId = new ObjectId(body.orgDetails._id);
    const createdBy = new ObjectId(body.userId);
    const createdDate = new Date();

    // Check for duplicate template name in the same org
    const query = { 
      templateName: body.templateName.trim().toLowerCase(), 
      orgId 
    };
    const { status: existing } = await getOne(query, salaryTemplatesCollection);

    if (existing) {
      return {
        status: false,
        message: `Salary template "${body.templateName}" already exists.`,
      };
    }

    const components = (body.components || []).map((comp) => ({
      componentName: new ObjectId(comp.componentName), 
      valueType: comp.valueType,
      componentValue: comp.componentValue,
      percentageOf: (comp.percentageOf || []).map((item) => ({
        type: item.type, 
        value: item.type === "component" ? new ObjectId(item.value) : item.value,
      })),
    }));

    const templateObj = {
      templateName: body.templateName.trim().toLowerCase(),
      description: body.description,
      components,
      orgId,
      createdBy,
      createdDate,
      isActive: true,
    };

    const result = await create(templateObj, salaryTemplatesCollection);

    return {
      status: true,
      data: result,
      message: "Salary template created successfully",
    };
  } catch (error) {
    logger.error("Error while creating salary template", error);
    throw error;
  }
};

export const listSalaryTemplates = async (body) => {
  try {
    if (!body.orgDetails?._id) {
      throw new Error("orgId is required");
    }

    const params = {
      orgId: new ObjectId(body.orgDetails._id),
      isActive: true,
    };

    const aggregationPipeline = [
      { $match: params },
      {
        $lookup: {
          from: "salaryComponents",
          localField: "components.componentName",
          foreignField: "_id",
          as: "componentDocs",
        },
      },
      {
        $addFields: {
          components: {
            $map: {
              input: "$components",
              as: "comp",
              in: {
                componentName: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$componentDocs",
                        as: "doc",
                        cond: { $eq: ["$$doc._id", "$$comp.componentName"] },
                      },
                    },
                    0,
                  ],
                },
                valueType: "$$comp.valueType",
                componentValue: "$$comp.componentValue",
                percentageOf: "$$comp.percentageOf",
              },
            },
          },
        },
      },
      { $project: { componentDocs: 0 } },
    ];

    const paginationQuery = {
      page: body.page || 1,
      limit: body.limit || 10,
      sortOrder: -1,
      sortBy: "_id",
    };

    return await aggregationWithPegination(
      aggregationPipeline,
      paginationQuery,
      salaryTemplatesCollection
    );
  } catch (error) {
    logger.error("Error while listing salary templates", error);
    throw error;
  }
};

export const previewSalaryTemplate = async (body) => {
  try {
    const { ctc, templateId } = body;

    if (!ctc || isNaN(ctc)) {
      throw new Error("Valid CTC amount is required");
    }
    if (!templateId) {
      throw new Error("templateId is required");
    }

    const pipeline = [
      { $match: { _id: new ObjectId(templateId), isActive: true } },
      {
        $lookup: {
          from: salaryComponentsCollection,
          localField: "components.componentName",
          foreignField: "_id",
          as: "componentDocs",
        },
      },
      {
        $addFields: {
          components: {
            $map: {
              input: "$components",
              as: "comp",
              in: {
                componentName: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$componentDocs",
                        as: "doc",
                        cond: { $eq: ["$$doc._id", "$$comp.componentName"] },
                      },
                    },
                    0,
                  ],
                },
                valueType: "$$comp.valueType",
                componentValue: "$$comp.componentValue",
                percentageOf: "$$comp.percentageOf",
              },
            },
          },
        },
      },
      { $project: { componentDocs: 0 } },
    ];

    const { status, data } = await aggregate(pipeline, salaryTemplatesCollection);
    if (!status || !data?.length) throw new Error("Template not found");

    const template = data[0];
    const totalCTC = parseFloat(ctc);
    const comps = template.components || [];

    const safeNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const compId = (comp) => {
      const cid = comp?.componentName?._id || comp?.componentName;
      return cid?.toString?.() || String(cid);
    };

    const compValues = {};
    const resolved = {};

    let changed = true;
    let iter = 0;
    const SAFETY = 100;

    while (changed && iter < SAFETY) {
      iter++;
      changed = false;

      const currEarnings = comps.reduce((acc, c) => {
        const id = compId(c);
        if (c?.componentName?.category === "earning" && resolved[id]) {
          return acc + safeNum(compValues[id]);
        }
        return acc;
      }, 0);

      const currDeductions = comps.reduce((acc, c) => {
        const id = compId(c);
        if (c?.componentName?.category === "deduction" && resolved[id]) {
          return acc + safeNum(compValues[id]);
        }
        return acc;
      }, 0);

      for (const comp of comps) {
        const id = compId(comp);
        if (!id || resolved[id]) continue;

        if (comp.valueType === "fixed") {
          compValues[id] = safeNum(comp.componentValue);
          resolved[id] = true;
          changed = true;
          continue;
        }

        if (comp.valueType === "percentage") {
          const pct = safeNum(comp.componentValue) / 100;
          const refs = Array.isArray(comp.percentageOf) ? comp.percentageOf : [];

          let baseSum = 0;
          let canResolve = true;

          for (const basis of refs) {
            if (basis.type === "special") {
              const key = String(basis.value).toLowerCase();
              if (key === "ctc") baseSum += totalCTC;
              else if (key === "gross") baseSum += currEarnings;
              else if (key === "net") baseSum += Math.max(0, currEarnings - currDeductions);
            } else if (basis.type === "component") {
              const refId = basis.value?.toString?.() || String(basis.value);
              if (resolved[refId]) baseSum += safeNum(compValues[refId]);
              else {
                canResolve = false;
                break;
              }
            }
          }

          if (canResolve) {
            compValues[id] = pct * baseSum;
            resolved[id] = true;
            changed = true;
          }
        }
      }
    }

    for (const comp of comps) {
      const id = compId(comp);
      if (!resolved[id]) compValues[id] = 0;
    }

    let totalEarnings = 0;
    let totalDeductions = 0;
    const earnings = [];
    const deductions = [];

    for (const comp of comps) {
      const id = compId(comp);
      const meta = comp.componentName || {};
      const cat = meta.category || "earning";
      const name = meta.name || id;
      const value = safeNum(compValues[id]);

      if (cat === "earning") {
        totalEarnings += value;
        earnings.push({ name, value });
      } else {
        totalDeductions += value;
        deductions.push({ name, value });
      }
    }

    const gross = totalEarnings;
    const netSalary = totalEarnings - totalDeductions;

    return {
      status: true,
      message: "Salary calculated successfully",
      data: {
        ctc: totalCTC,
        gross,
        earnings,
        deductions,
        totalEarnings,
        totalDeductions,
        netSalary,
      },
    };
  } catch (error) {
    logger.error("Error while calculating salary from template", error);
    throw error;
  }
};

export const toggleSalaryComponents = async (body) => {
  try {
    const { componentIds, isActive, orgDetails } = body;

    const orgId = new ObjectId(orgDetails._id);
    const ids = componentIds.map((id) => new ObjectId(id));

    const filter = { _id: { $in: ids }, orgId };
    const update = {
      $set: {
        isActive,
      },
    };

    const result = await updateMany(filter, update, salaryComponentsCollection);

    return {
      status: true,
      message: `Salary components ${isActive ? "enabled" : "disabled"} successfully`,
      data: result,
    };
  } catch (error) {
    logger.error("Error while toggling salary components", error);
    throw error;
  }
};