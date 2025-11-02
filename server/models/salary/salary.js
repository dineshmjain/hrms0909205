import { ObjectId } from "mongodb";
import { create, getOne, getMany, createMany, updateMany, aggregate, aggregationWithPegination } from "../../helper/mongo.js";
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

    const query = {
      orgId: new ObjectId(body.orgDetails._id),
    };

    if (body.category && body.category !== "all") {
      query.isStatutory = body.category === "statutory";
    }

    if (typeof body.isActive === "boolean") {
      query.isActive = body.isActive;
    }

    const projection = body.projection || {}; // optional selective fields

    return await getMany(query, salaryComponentsCollection, projection);
  } catch (error) {
    logger.error("Error while listSalaryComponents", error);
    return { status: false, message: error.message };
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

export const getSalaryTemplate = async (body) => {
  try {
    if (!body.orgDetails?._id) {
      throw new Error("orgId is required");
    }
    if (!body.templateId) {
      throw new Error("templateId is required");
    }

    const params = {
      _id: new ObjectId(body.templateId),
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

    return await aggregate(aggregationPipeline, salaryTemplatesCollection);
  } catch (error) {
    logger.error("Error while getting salary template", error);
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

export const previewSalaryBreakup = async (body) => {
  try {
    const gross = body.gross;
    const template = body.template;
    const statutoryDocs = body.statutoryDocs;
    let templateComps = template.components || [];

    // --- STEP 2: AUTO-INJECT STATUTORY COMPONENTS (EPF, ESI, PT, etc.)

    if (statutoryDocs?.status && Array.isArray(statutoryDocs.data)) {
      const existingIds = new Set(
        templateComps.map((c) => String(c.componentName?._id || c.componentName))
      );
      const existingNames = new Set(
        templateComps.map((c) => c.componentName?.name?.toLowerCase?.() || "")
      );

      for (const stat of statutoryDocs.data) {
        const statId = String(stat._id);
        const statName = (stat.name || "").toLowerCase();

        if (existingIds.has(statId) || existingNames.has(statName)) continue;

        const appliesTo = (stat.statutoryDetails?.appliesTo || []).map(String);
        const applies = appliesTo.some((id) => existingIds.has(id));

        if (applies || statName.includes("tax") || statName.includes("esi") || statName.includes("epf")) {
          templateComps.push({
            componentName: stat,
            valueType: "statutory",
            componentValue: null,
            percentageOf: [],
          });
          existingIds.add(statId);
          existingNames.add(statName);
        }
      }
      console.log(templateComps)
    }

    const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const compId = (comp) => {
      const cid = comp?.componentName?._id || comp?.componentName;
      return cid?.toString?.() || String(cid);
    };

    const compValues = {};
    const resolved = {};
    let changed = true;
    let iter = 0;
    const SAFETY = 100;

    // --- STEP 3: MAIN CALCULATION LOOP
    while (changed && iter < SAFETY) {
      iter++;
      changed = false;

      const currEarnings = templateComps.reduce((acc, c) => {
        const id = compId(c);
        if (c?.componentName?.category === "earning" && resolved[id]) {
          return acc + safeNum(compValues[id]);
        }
        return acc;
      }, 0);

      const currDeductions = templateComps.reduce((acc, c) => {
        const id = compId(c);
        if (c?.componentName?.category === "deduction" && resolved[id]) {
          return acc + safeNum(compValues[id]);
        }
        return acc;
      }, 0);

      for (const comp of templateComps) {
        const id = compId(comp);
        if (!id || resolved[id]) continue;

        const meta = comp.componentName || {};

        // --- Fixed components
        if (comp.valueType === "fixed") {
          compValues[id] = safeNum(comp.componentValue);
          resolved[id] = true;
          changed = true;
          continue;
        }

        // --- Percentage-based components
        if (comp.valueType === "percentage") {
          const pct = safeNum(comp.componentValue) / 100;
          const refs = Array.isArray(comp.percentageOf) ? comp.percentageOf : [];

          let baseSum = 0;
          let canResolve = true;

          for (const basis of refs) {
            if (basis.type === "special") {
              const key = String(basis.value).toLowerCase();
              if (key === "gross") baseSum += gross;
              else if (key === "ctc") baseSum += gross; // fallback for old templates
              else if (key === "net")
                baseSum += Math.max(0, currEarnings - currDeductions);
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

          continue;
        }

        // --- Statutory (EPF, ESI, PT, etc.)
        if (meta.isStatutory && meta.statutoryDetails) {
          const details = meta.statutoryDetails || {};
          const employeePct = safeNum(details.contribution?.employee);
          const employerPct = safeNum(details.contribution?.employer);
          const appliesTo = details.appliesTo || [];
          const limit = safeNum(details.limit);
          const fixedAmount = safeNum(details.amount);

          if (fixedAmount > 0) {
            compValues[id] = fixedAmount;
            resolved[id] = true;
            changed = true;
            continue;
          }

          let baseSum = 0;
          let canResolve = true;

          for (const refId of appliesTo) {
            const refStr = refId?.toString?.() || String(refId);
            if (resolved[refStr]) baseSum += safeNum(compValues[refStr]);
            else {
              canResolve = false;
              break;
            }
          }

          if (canResolve) {
            const cappedBase = limit > 0 ? Math.min(baseSum, limit) : baseSum;
            const empValue = employeePct * cappedBase;
            const employerValue = employerPct * cappedBase;

            compValues[id] = empValue;
            compValues[`${id}_employer`] = employerValue;

            resolved[id] = true;
            changed = true;
          }
        }
      }
    }

    // --- STEP 4: Compute totals (Monthly + Yearly)
    let totalEarnings = 0;
    let totalDeductions = 0;
    let totalEmployerContrib = 0;

    const earnings = [];
    const deductions = [];
    const employerContribs = [];

    for (const comp of templateComps) {
      const id = compId(comp);
      const meta = comp.componentName || {};
      const cat = meta.category || "earning";
      const name = meta.name || id;
      const value = safeNum(compValues[id]);

      // Handle statutory components
      if (meta.isStatutory && meta.statutoryDetails) {
        const details = meta.statutoryDetails;
        const baseAppliesTo = details.appliesTo || [];
        const limit = safeNum(details.limit);
        const employeePct = safeNum(details.contribution?.employee);
        const employerPct = safeNum(details.contribution?.employer);
        const fixedAmount = safeNum(details.amount);

        if (fixedAmount > 0) {
          deductions.push({
            name,
            monthly: fixedAmount,
            yearly: fixedAmount * 12,
          });
          totalDeductions += fixedAmount;
          continue;
        }

        let baseSum = 0;
        for (const refId of baseAppliesTo) {
          const refStr = refId?.toString?.() || String(refId);
          baseSum += safeNum(compValues[refStr]);
        }

        const cappedBase = limit > 0 ? Math.min(baseSum, limit) : baseSum;
        const empDeduction = employeePct * cappedBase;
        const employerShare = employerPct * cappedBase;

        deductions.push({
          name: `${name} (Employee Deduction)`,
          monthly: empDeduction,
          yearly: empDeduction * 12,
        });
        employerContribs.push({
          name: `${name} (Employer Contribution)`,
          monthly: employerShare,
          yearly: employerShare * 12,
        });

        totalDeductions += empDeduction;
        totalEmployerContrib += employerShare;
        continue;
      }

      // Normal components
      if (cat === "earning") {
        totalEarnings += value;
        earnings.push({ name, monthly: value, yearly: value * 12 });
      } else {
        totalDeductions += value;
        deductions.push({ name, monthly: value, yearly: value * 12 });
      }
    }

    const grossValue = gross;
    const netSalary = totalEarnings - totalDeductions;
    const ctcValue = totalEarnings + totalEmployerContrib;

    return {
      status: true,
      message: "Salary calculated successfully",
      data: {
        gross: grossValue,
        earnings,
        deductions,
        employerContribs,
        totalEarnings: {
          monthly: totalEarnings,
          yearly: totalEarnings * 12,
        },
        totalDeductions: {
          monthly: totalDeductions,
          yearly: totalDeductions * 12,
        },
        totalEmployerContrib: {
          monthly: totalEmployerContrib,
          yearly: totalEmployerContrib * 12,
        },
        netSalary: {
          monthly: netSalary,
          yearly: netSalary * 12,
        },
        totalCTCValue: {
          monthly: ctcValue,
          yearly: ctcValue * 12,
        },
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