import { status } from '@grpc/grpc-js';
import { Joi } from 'celebrate';
import { ObjectId } from 'mongodb';
import { shiftTypes, allowed_user_params, allowed_department_params, allowed_designation_params } from './constants.js';



export let validation = {
  registration: {
    body: Joi.object().keys({
      mobile: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({ m: "Mobile must be of 10 degit" }),
      password: Joi.string().min(8).required(),
      defaultLanguage: Joi.string().valid("en", "hi"),
      email: Joi.string().email().allow("").optional(),
      orgName : Joi.string().optional(),
      orgTypeId : Joi.string().optional(),
      name: Joi.object()
        .required()
        .keys({
          firstName: Joi.string().min(3).required(),
          middleName: Joi.string(),
          lastName: Joi.string().allow("").optional(),
        }),
    }),
  },

    /**
     * shift creation validation fom body.
     * startTime and endTime validation time in range
     * (01 to 24) : (00 to 59)
     */
    shiftCreation: {
        body: Joi.object().required().keys({
            name: Joi.string().min(3).required(),
            startTime: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
                'string.pattern.base': 'Start time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            endTime: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
                'string.pattern.base': 'End time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            minIn: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'minIn time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            minOut: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'minOut time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            maxIn: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'maxIn time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            maxOut: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'maxOut time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            bgColor: Joi.string(),
            textColor: Joi.string(),
            clientMappedId: Joi.string().optional(),
            clientId: Joi.string().optional(),
            branchIds: Joi.array()
            .items(Joi.string().required())
            .optional()
            .messages({
              'array.base': `"branchIds" must be an array of strings`,
              'string.base': `Each branchId must be a string`,
            }),
            reportTimeIn: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'reportTimeIn time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
            reportTimeOut: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).optional().messages({
                'string.pattern.base': 'reportTimeOut time must be in the format HH:MM and between 00:00 and 23:59.'
            }),
        })
    },

  shiftDateCreate: {
    body: Joi.object()
      .required()
      .keys({
        startDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        endDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        employeeIds: Joi.array()
          .required()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(`"${value}" is not a valid ObjectId`);
              }
              return value;
            })
          ),
        // swappedUserId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('swappedUserId must be a valid ObjectId'),
        // swappedUserShiftId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('swappedUserShiftId must be a valid ObjectId'),
        // reason: Joi.string(),
        // shifts:Joi.array().items(
        //     Joi.object({
        //         currentShiftId : Joi.string().pattern(/^([a-f\d]{24}|WO)$/i).message('currentShiftId must be a valid ObjectId or WO').required(),
        //         orgId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('orgId must be a valid ObjectId').optional(),
        //         branchId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('branchId must be a valid ObjectId').optional(),
        //         clientId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientId must be a valid ObjectId').optional(),
        //         clientBranchId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientBranchId must be a valid ObjectId').optional(),
        //         clientMappedId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientMappedId must be a valid ObjectId').optional()
        //     })
        // )
        shifts: Joi.array().items(
          Joi.object({
            currentShiftId: Joi.string()
              .pattern(/^([a-f\d]{24}|WO)$/i)
              .message("currentShiftId must be a valid ObjectId or WO")
              .required(),
            orgId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("orgId must be a valid ObjectId")
              .optional(),
            branchId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("branchId must be a valid ObjectId")
              .optional(),
            clientId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientId must be a valid ObjectId")
              .optional(),
            clientBranchId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientBranchId must be a valid ObjectId")
              .optional(),
            clientMappedId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientMappedId must be a valid ObjectId")
              .optional(),
            startTime: Joi.string()
              .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
              .messages({
                "string.pattern.base":
                  "Start time must be in the format HH:MM and between 01:00 and 24:59.",
              }),
            endTime: Joi.string()
              .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
              .messages({
                "string.pattern.base":
                  "End time must be in the format HH:MM and between 01:00 and 24:59.",
              }),
          }).custom((value, helpers) => {
            // orgId & branchId dependency
            // if ((value.orgId && !value.branchId) || (!value.orgId && value.branchId)) {
            //     return helpers.message('Both orgId and branchId are required together in shifts');
            // }
            // clientId, clientMappedId, clientBranchId dependency
            const clientFields = [
              value.clientId,
              value.clientMappedId,
              value.clientBranchId,
            ];
            const filled = clientFields.filter(Boolean).length;
            if (filled > 0 && filled < 3) {
              return helpers.message(
                "clientId, clientMappedId, and clientBranchId are all required together in shifts"
              );
            }
            return value;
          })
        ),
      }),
  },
  shiftDateList: {
    body: Joi.object()
      .required()
      .keys({
        id: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Shift roster Id must be a valid ObjectId"),
        startDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Start Date must be in yyyy-mm-dd",
          }),
        endDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "End Date must be in yyyy-mm-dd",
          }),
        shiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("shiftId must be a valid ObjectId")
          .optional(),

        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        groupBy: Joi.array().valid("employeeIds").optional(),
        isClient: Joi.boolean().optional(),

        orgIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("orgIds must be array of a valid ObjectId")
          )
          .optional(),
        branchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("branchId must be array of a valid ObjectId")
          )
          .optional(),
        clientMappedIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientMappedIds must be array of a valid ObjectId")
          )
          .optional(),
        clientBranchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientBranchIds must be array of a valid ObjectId")
          )
          .optional(),
        departmentIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("departmentIds must be array of a valid ObjectId")
          ),
        designationIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("designationIds must be array of a valid ObjectId")
          ),
        employeeIds: Joi.array()
          .optional()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(
                  `"${value}" is not a valid ObjectId in employeeIds`
                );
              }
              return value;
            })
          ),
      })
      .custom((value, helpers) => {
        // const hasOrg = value.orgIds && value.orgIds.length > 0;
        // const hasBranch = value.branchIds && value.branchIds.length > 0;
        // const hasClientMapped = value.clientMappedIds && value.clientMappedIds.length > 0;
        // const hasClientBranch = value.clientBranchIds && value.clientBranchIds.length > 0;

        // Exclusive validation
        // if ((hasOrg || hasBranch) && (hasClientMapped || hasClientBranch)) {
        //     return helpers.message('You cannot provide orgIds/branchIds together with clientMappedIds/clientBranchIds in the same request.');
        // }

        // // At least one of orgIds or clientMappedIds is required
        // if (!(hasOrg || hasClientMapped)) {
        //     return helpers.message('Either orgIds or clientMappedIds is required.');
        // }

        return value;
      }),
  },

  shiftDateUpdate: {
    body: Joi.object()
      .required()
      .keys({
        id: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Shift roster Id must be a valid ObjectId"),
        shiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("projectId must be a valid ObjectId"),
        date: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        employeeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("userId must be a valid ObjectId"),
        employeeShiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("userShiftId must be a valid ObjectId")
          .optional(),
        swappedUserId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("swappedUserId must be a valid ObjectId")
          .optional(),
        swappedUserShiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("swappedUserShiftId must be a valid ObjectId")
          .optional(),
        assignedShiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("assignedShiftId must be a valid ObjectId"),
        status: Joi.string().valid("approved", "rejected"),
        reason: Joi.string(),
        isActive: Joi.bool(),
      }),
  },

  shiftDateUpdation: {
    body: Joi.object()
      .required()
      .keys({
        // id: Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('Shift roster Id must be a valid ObjectId'),
        // shiftId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('projectId must be a valid ObjectId'),
        startDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Start Date must be in yyyy-mm-dd",
          }),
        endDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "End Date must be in yyyy-mm-dd",
          }),
        employeeIds: Joi.array()
          .required()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(`"${value}" is not a valid ObjectId`);
              }
              return value;
            })
          ),
        shifts: Joi.array().items(
          Joi.object({
            currentShiftId: Joi.alternatives()
              .try(
                Joi.string().pattern(/^[a-f\d]{24}$/i),
                Joi.string().valid("WO")
              )
              .messages({
                "alternatives.match":
                  "currentShiftId must be a valid ObjectId or WO",
              })
              .required(),
            orgId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("orgId must be a valid ObjectId")
              .optional(),
            branchId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("branchId must be a valid ObjectId")
              .optional(),
            clientId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientId must be a valid ObjectId")
              .optional(),
            clientBranchId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientBranchId must be a valid ObjectId")
              .optional(),
            clientMappedId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientMappedId must be a valid ObjectId")
              .optional(),
            startTime: Joi.string()
              .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
              .messages({
                "string.pattern.base":
                  "Start time must be in the format HH:MM and between 01:00 and 24:59.",
              }),
            endTime: Joi.string()
              .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
              .messages({
                "string.pattern.base":
                  "End time must be in the format HH:MM and between 01:00 and 24:59.",
              })
              .optional(),
            shiftGroupId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("shiftGroupId must be a valid ObjectId")
              .optional(),
          }).custom((value, helpers) => {
            // orgId & branchId dependency
            // if ((value.orgId && !value.branchId) || (!value.orgId && value.branchId)) {
            //     return helpers.message('Both orgId and branchId are required together in shifts');
            // }
            // clientId, clientMappedId, clientBranchId dependency
            const clientFields = [
              value.clientId,
              value.clientMappedId,
              value.clientBranchId,
            ];
            const filled = clientFields.filter(Boolean).length;
            if (filled > 0 && filled < 3) {
              return helpers.message(
                "clientId, clientMappedId, and clientBranchId are all required together in shifts"
              );
            }
            return value;
          })
        ),
        // employeeId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('userId must be a valid ObjectId'),
        // employeeShiftId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('userShiftId must be a valid ObjectId').optional(),
        // swappedUserId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('swappedUserId must be a valid ObjectId').optional(),
        // swappedUserShiftId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('swappedUserShiftId must be a valid ObjectId').optional(),
        // assignedShiftId : Joi.string().pattern(/^[a-f\d]{24}$/i).message('assignedShiftId must be a valid ObjectId'),
        // status: Joi.string().valid("approved", "rejected"),
        // reason: Joi.string(),
        // isActive: Joi.bool(),
      }),
  },
  shiftDateSwap: {
    body: Joi.object()
      .required()
      .keys({
        fromEmployeeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("From User Id must be a valid ObjectId"),
        toEmployeeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("To User Id must be a valid ObjectId"),
        date: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
      }),
  },
  /**
   * admin adding employee in organization
   */
  addingUser: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.object()
          .required()
          .keys({
            firstName: Joi.string().min(3).required(),
            // middleName: Joi.string(),
            lastName: Joi.string().allow("").optional(),
          }),
        mobile: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^\d{10}$/)
          .required()
          .messages({
            "string.pattern.base": "Mobile number must be in between 0 to 9",
          }),
        guardianNumber: Joi.string()
        .min(10)
        .max(10)
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "guardianNumber must be in between 0 to 9",
        }),
        emergencyNumber: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^\d{10}$/)
          .required()
          .messages({
            "string.pattern.base": "emergencyNumber must be in between 0 to 9",
          }),
        guardianName:Joi.string().required(),

        email: Joi.string().email().allow("").optional(),
        profileImage: Joi.string(),
        password: Joi.string().min(8).required(),
        gender: Joi.string().valid("female", "male"),
        martialStatus: Joi.string(),
        bloodGroup: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
        qualification: Joi.string().max(100),
        employeeId: Joi.string().max(100),
        workTimingType:Joi.string().valid("branch", "shift").required(),
        shiftIds: Joi.array()
          .optional()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(`"${value}" is not a valid ObjectId`);
              }
              return value;
            })
          ),
        salaryConfig: Joi.boolean().optional(),
        joinDate: Joi.string()
          .required()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        dateOfBirth: Joi.string()
          .required()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        isSubOrg: Joi.boolean().optional(),
        // subOrgId: Joi.when('isSubOrg',{
        //     is : true,
        //     then: Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('sub Org Id must be a valid ObjectId'),
        //     otherwise : Joi.string().optional().pattern(/^[a-f\d]{24}$/i).message('sub Org Id must be a valid ObjectId')
        // }),
        subOrgId: Joi.when("isSubOrg", {
          is: true,
          then: Joi.string()
            .required()
            .pattern(/^[a-f\d]{24}$/i)
            .messages({
              "any.required": "Please select subOrganization",
              "string.empty": "Please select subOrganization",
              "string.pattern.base":
                "Sub Organization ID must be a valid ObjectId",
            }),
          otherwise: Joi.string()
            .optional()
            .pattern(/^[a-f\d]{24}$/i)
            .messages({
              "string.pattern.base":
                "Sub Organization ID must be a valid ObjectId",
            }),
        }),

        // example: other field

        branchId: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Each branchId must be a valid ObjectId")
          )
          .required(),
        departmentId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("department Id must be a valid ObjectId"),
        designationId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("designation Id must be a valid ObjectId"),
        // roleId:Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('role Id must be a valid ObjectId'),
      }),
  },

  /**
   * admin adding employee in organization
   */
  updatingUser: {
    body: Joi.object()
      .required()
      .keys({
        id: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("user Id must be a valid ObjectId"),
        name: Joi.object().keys({
          firstName: Joi.string().min(3),
          // middleName: Joi.string(),
          lastName: Joi.string(),
        }),
        email: Joi.string().email(),
        profileImage: Joi.string(),
        // leaveGroupId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('leaveGroupId must be a valid ObjectId'),
        // assignmentId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('assignmentId must be a valid ObjectId'),
        // shiftGroupId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('assignmentId must be a valid ObjectId'),
        gender: Joi.string().valid("female", "male", "other"),
        joinDate: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        dateOfBirth: Joi.string()
          .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
          .messages({
            "string.pattern.base": "Date must be in yyyy-mm-dd",
          }),
        password: Joi.string(),
        disabledModules: Joi.array().items(
          Joi.object({
            moduleId: Joi.string()
              .required()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .message("moduleId must be a valid object."),
            permissions: Joi.array().items(
              Joi.string().valid("c", "r", "u", "d")
            ),
          })
        ),
        bloodGroup: Joi.string()
          .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
          .optional(),
        guardianName: Joi.string().optional(),
        qualification: Joi.string().max(100).optional(),
        employeeId: Joi.string().max(100).optional(),
        workTimingType: Joi.string()
          .valid("branch", "shift")
          .optional(),
        shiftIds: Joi.array()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(`"${value}" is not a valid ObjectId`);
              }
              return value;
            })
          )
          .optional(),
        salaryConfig: Joi.boolean().optional(),

        guardianNumber: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^\d{10}$/)
          .optional()
          .messages({
            "string.pattern.base": "guardianNumber must be in between 0 to 9",
          }),

        emergencyNumber: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^\d{10}$/)
          .optional()
          .messages({
            "string.pattern.base": "emergencyNumber must be in between 0 to 9",
          }),

        isSubOrg: Joi.boolean().optional(),
        martialStatus:Joi.string().optional()

      }),
  },
  updatingUserOfficial: {
    body: Joi.object()
      .required()
      .keys({
        id: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("user Id must be a valid ObjectId"),
        roleId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("roleId must be a valid ObjectId"),
        branchId: Joi.array().items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .message("branch Id must be a valid ObjectId")
        ),
        departmentId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("department Id must be a valid ObjectId"),
        designationId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("designation Id must be a valid ObjectId"),
        subOrgId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("sub Organization Id Id must be a valid ObjectId"),
        joinDate: Joi.string().optional(),
        workTimingType: Joi.string()
          .valid("branch", "shift")
          .optional(),
        shiftIds: Joi.array()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(`"${value}" is not a valid ObjectId`);
              }
              return value;
            })
          ).optional(),
        employeeId: Joi.string().max(100).optional()
      }),
  },
  updatingUserAddress: {
    body: Joi.object()
      .required()
      .keys({
        id: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("user Id must be a valid ObjectId"),
        presentAddress: Joi.object().keys({
          geoLocation: Joi.object({
            city: Joi.string().required(),
            district: Joi.string().optional(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            pincode: Joi.optional(),
            address: Joi.string().required(),
          }).optional(),
          geoJson: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
          }).optional(),
          address: Joi.object({
            addressTypeId: Joi.string()
              .optional()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Address Type Id must be a valid ObjectId"),
            hno: Joi.string(),
            street: Joi.string(),
            landmark: Joi.string(),
            village: Joi.string(),
            taluk: Joi.string(),
            city: Joi.string().optional(),
            district: Joi.string().optional(),
            state: Joi.string().optional(),
            country: Joi.string().optional(),
            pincode: Joi.optional(),
          }).optional(),
        }),
        permanentAddress: Joi.object().keys({
          geoLocation: Joi.object({
            city: Joi.string().required(),
            district: Joi.string().optional(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            pincode: Joi.optional(),
            address: Joi.string().required(),
          }).optional(),
          geoJson: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
          }).optional(),
          address: Joi.object({
            addressTypeId: Joi.string()
              .optional()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Address Type Id must be a valid ObjectId"),
            hno: Joi.string(),
            street: Joi.string(),
            landmark: Joi.string(),
            village: Joi.string(),
            taluk: Joi.string(),
            city: Joi.string().optional(),
            district: Joi.string().optional(),
            state: Joi.string().optional(),
            country: Joi.string().optional(),
            pincode: Joi.optional(),
          }).optional(),
        }),
        isPermanentSame: Joi.boolean(),
      }),
  },

  /**
   * shift group creation validation
   */
  // shiftGroupCreate: {
  //     body: Joi.object().required().keys({
  //         name: Joi.string().min(3).required(),
  //         type:Joi.string().valid(...Object.values(shiftTypes)).required()
  //         .messages({
  //           'any.only': `Invalid type. please choose one of ${Object.values(shiftTypes)}`,
  //           'string.base': 'type must be a string',
  //         }),
  //         startDate: Joi.date().greater('now').required().messages({
  //             'date.greater': 'Start Date must be greater than today',
  //             'date.base': 'Start Date must be a valid date',
  //         }),
  //         endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
  //             'date.greater': 'End Date must be greater that Start Date',
  //             'date.base': 'End Date must be a valid date',
  //         }),
  //         frequency: Joi.number().optional(),
  //         // shiftIds: Joi.array().items(Joi.string()).optional().messages({ 'array.includes': 'Each element must be either "WO" or a valid ObjectId.' }),
  //         pattern:Joi.when('type', {
  //           switch: [
  //             {
  //                 is: shiftTypes.pattern, then: Joi.array().items(Joi.string()).optional().messages({
  //                     'array.includes': 'Each element must be either "WO" or a valid ObjectId.'
  //                 })
  //             },
  //             {
  //                 is: shiftTypes.weekDayWise, then: Joi.array().items(Joi.object()).optional().length(7).messages({
  //                     'array.length': `No of shift in patter must have exactly 7 items`,
  //                     'array.includes': 'Each element must be either "WO" or a valid ObjectId.'
  //                 })
  //             },
  //             {
  //                 is: shiftTypes.weekly, then: Joi.object().required()
  //             },
  //             {
  //                 is: shiftTypes.monthlyWeekWise, then: Joi.object().required().length(5).messages({'object.length': 'Number of week in pattern must be 5 in monthly week wise type'})
  //             },
  //             {
  //                 is: shiftTypes.monthly, then: Joi.object().required().min(1).max(12).messages({
  //                     'object.min': 'Number of month in pattern must be minimum 1 in monthly type',
  //                     'object.max': 'Number of month in pattern must be maximum 12 in monthly type',
  //                 })
  //             },
  //           ],
  //           otherwise: Joi.forbidden()
  //         }),
  //         months: Joi.array().when('type', {
  //           is: 'monthlyWeekWise',
  //           then: Joi.array().valid(...[0,1,2,3,4,5,6,7,8,9,10,11]).min(1).max(12).required(),
  //           otherwise: Joi.forbidden()
  //         }),
  //         userIds:Joi.array().optional(),
  //         designationIds:Joi.array().optional(),
  //         departmentIds:Joi.array().optional(),
  //         branchIds:Joi.array().optional(),
  //     }),
  // },

  shiftGroupCreate: {
    body: Joi.object()
      .required()
      .keys({
        year: Joi.number().integer().min(2000).max(2100).required().messages({
          "number.base": "Year must be a number",
          "number.integer": "Year must be an integer",
          "number.min": "Year must be at least 2000",
          "number.max": "Year must not exceed 2100",
        }),
        timeFrame: Joi.array()
          .items(
            Joi.object({
              month: Joi.number().integer().min(1).max(12).required().messages({
                "number.base": "Month must be a number",
                "number.integer": "Month must be an integer",
                "number.min": "Month must be at least 1",
                "number.max": "Month must be at most 12",
                "any.required": "Month is required",
              }),
              weeks: Joi.array()
                .items(Joi.number().integer().min(1).max(4))
                .min(1)
                .required()
                .messages({
                  "array.base": "Weeks must be an array",
                  "array.includes":
                    "Each week value must be a number between 1 and 4",
                  "array.min": "Weeks array must have at least one week",
                  "any.required": "Weeks is required",
                }),
            })
          )
          .min(1)
          .required()
          .messages({
            "array.base": "TimeFrame must be an array",
            "array.min": "TimeFrame must have at least one entry",
          }),
        patterns: Joi.array().items(Joi.object().required()).min(1).messages({
          "array.base": "Patterns must be an array",
          "array.includes": "Each pattern must be a valid object",
          "array.min": "At least one pattern is required",
        }),
      }),
  },

  shiftGroupAssign: {
    body: Joi.object()
      .keys({
        subOrgId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "subOrgId must be a string",
            "string.pattern": "subOrgId must be a valid ObjectId",
          }),
        branchId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "branchId must be a string",
            "string.pattern": "branchId must be a valid ObjectId",
          }),
        departmentId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "departmentId must be a string",
            "string.pattern": "departmentId must be a valid ObjectId",
          }),
        designationId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "designationId must be a string",
            "string.pattern": "designationId must be a valid ObjectId",
          }),
        userId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "userId must be a string",
            "string.pattern": "userId must be a valid ObjectId",
          }),
        patternId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional()
          .messages({
            "string.base": "patternId must be a string",
            "string.pattern": "patternId must be a valid ObjectId",
          }),
      })
      .required(),
  },

  unmapDepartment: {
    body: Joi.object().required().keys({
      branchId: Joi.string().required(),
      departmentId: Joi.string().required(),
    }),
  },

  // unmapDesignation :{
  //     body:Joi.object().required().keys({
  //         branchId:Joi.string().optional(),
  //         departmentId:Joi.string().optional(),
  //         designationId:Joi.string().optional()
  //     }).min(2)
  // },
  unmapDesignation: {
    body: Joi.object()
      .required()
      .keys({
        branchId: Joi.string().optional(),
        departmentId: Joi.string().optional(),
        designationId: Joi.string().required(),
      })
      .custom((value, helpers) => {
        const { branchId, departmentId, designationId } = value;

        // Ensure at least two fields are provided
        const nonEmptyFields = [branchId, departmentId, designationId].filter(
          Boolean
        ).length;
        if (nonEmptyFields < 2) {
          return helpers.message(
            "At least two fields of branch,department or designation are required."
          );
        }

        // Custom combinations
        if (branchId && designationId && !departmentId) {
          // Example: If branchId and designationId are present, departmentId can be optional
          return value;
        }

        if (departmentId && designationId && !branchId) {
          // Example: If departmentId and designation are present, branchId can be optional
          return value;
        }

        // More combinations can be added based on your needs

        return value;
      }),
  },

  /**
   * admin updating branch details
   */
  updatingBranch: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().min(3),
        isActive: Joi.bool(),
        // location: Joi.object().keys({
        //     latitude: Joi.string(),
        //     longitude: Joi.string(),
        //     city: Joi.string().min(3),
        //     state: Joi.string().min(3),
        //     country: Joi.string().min(3),
        //     pincode: Joi.string().min(6).max(6),
        //     address: Joi.string().min(3),
        //     landmark: Joi.string()
        // }),
        clientId: Joi.string(),
        id: Joi.string(),
        // businessTypeId:Joi.string(),
        inchargeName: Joi.string().min(3).optional(),
        mobile: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .optional()
          .messages({
            "any.required": "Mobile number is required",
            "string.pattern.base": "Mobile number must be a 10-digit number",
          }),
        floors: Joi.number().optional(),
        employeesRequired: Joi.number().optional(),
        area: Joi.string().optional(),
        patrolling: Joi.bool().optional(),
                timeSettingType: Joi.string()
          .valid("startEnd", "reporting")
          .optional()
          .description("Determines whether time is based on start/end or a single reporting time"),

        startTime: Joi.when("timeSettingType", {
          is: "startEnd",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "startTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        endTime: Joi.when("timeSettingType", {
          is: "startEnd",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "endTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        reportingTime: Joi.when("timeSettingType", {
          is: "reporting",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "reportingTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        maxIn: Joi.number()
          .integer()
          .min(0)
          .optional()
          .messages({
            "number.base": "maxIn must be a number",
          }),

        minOut: Joi.number()
          .integer()
          .min(0)
          .optional()
          .messages({
            "number.base": "minOut must be a number",
          }),

        weekOff: Joi.array()
          .items(
            Joi.string().valid(
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            )
          )
          .optional()
          .messages({
            "any.only": "weekOff must contain valid weekday names",
          }),

        // salaryCycle: Joi.number()
        //   .integer()
        //   .min(1)
        //   .max(31)
        //   .optional()
        //   .messages({
        //     "number.base": "salaryCycle must be a number between 1 and 31",
        //   }),
        salaryCycle: Joi.object({
          startDay: Joi.number()
            .integer()
            .min(1)
            .max(31)
            .required()
            .messages({
              "number.base": "salaryCycle.startDay must be a number between 1 and 31",
              "any.required": "salaryCycle.startDay is required"
            }),
        
          endDay: Joi.number()
            .integer()
            .min(1)
            .max(31)
            .required()
            .messages({
              "number.base": "salaryCycle.endDay must be a number between 1 and 31",
              "any.required": "salaryCycle.endDay is required"
            })
        })
        .optional()
        .messages({
          "object.base": "salaryCycle must be an object with startDay and endDay"
        }),

        financialYear: Joi.object({
          startDate: Joi.string().required().messages({
            "date.base": "financialYear.startDate must be a valid date",
            "any.required": "financialYear.startDate is required"
          }),
          endDate: Joi.string().required().messages({
            "date.base": "financialYear.endDate must be a valid date",
            "date.greater": "financialYear.endDate must be after financialYear.startDate",
            "any.required": "financialYear.endDate is required"
          })
        })
        .optional()
        .messages({
          "object.base": "financialYear must be an object with startDate and endDate"
        }),

        assignToUserId: Joi.array().items(
          Joi.string().custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
              return helpers.message(`"${value}" is not a valid ObjectId`);
            }
            return value;
          })
        ),
        subOrgId: Joi.string(),
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }).optional(),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.required(),
          address: Joi.string().required(),
        }).optional(),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).optional(),
        panNo: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
          .messages({
            "string.pattern.base": "PAN number must be in formet of ABCDE1234A",
            "string.empty": "PAN number is required",
          })
          .optional(),
        gstNo: Joi.string()
          .min(15)
          .max(15)
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
          .messages({
            "string.pattern.base":
              "GST number must be in formet of 07AAAAA1234A1Z5",
            "string.empty": "GST number is required",
          })
          .optional(),
      }),
  },
  getBranchRadius: {
    body: Joi.object()
      .required()
      .keys({
        subOrgId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("orgId must be a valid ObjectId"),
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
        limit: Joi.number().optional(),
        page: Joi.number().optional(),
        search: Joi.string().optional(),
      }),
  },
  updateBranchRadius: {
    body: Joi.object()
      .required()
      .keys({
        branchId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("branch Id must be a valid ObjectId"),
        subOrgId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("subOrg Id must be a valid ObjectId"),
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
        radius: Joi.number().optional().min(0),
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }).optional(),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.required(),
          address: Joi.string().required(),
        }).optional(),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).optional(),
      }),
  },

  /**
   * create organization
   */

  clientMap: {
    body: Joi.object().required().keys({
      clientId: Joi.string().required(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      designationId: Joi.string().optional(),
    }),
  },

  createClientOrg: {
    body: Joi.object().keys({
      // mobile: Joi.string().min(10).max(10).pattern(/^\d{10}$/).required().messages({
      //     'string.pattern.base': 'Mobile number must be in between 0 to 9'
      // }),
      name: Joi.string().min(3).required(),
      orgTypeId: Joi.string().required(),
      // panNo: Joi.string().min(10).max(10).pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).messages({
      //     'string.pattern.base': 'PAN number must be in formet of ABCDE1234A', 'string.empty': 'PAN number is required',
      // }),
      // gstNo: Joi.string().min(15).max(15).pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).messages({
      //     'string.pattern.base': 'GST number must be in formet of 07AAAAA1234A1Z5', 'string.empty': 'GST number is required',
      // }),
      // owner: Joi.object().keys({
      //     FirstName: Joi.string().min(1).required(),
      //     LastName: Joi.string().min(1).required(),
      //     mobile: Joi.string().length(10).pattern(/^\d{10}$/).required().messages({
      //       'string.pattern.base': 'Mobile number must contain only digits from 0 to 9',
      //       'string.length': 'Mobile number must be exactly 10 digits',
      //     }),
      //   }).required(),

      // address: Joi.object().required()
    }),
  },

  clientUser: {
    body: Joi.object().keys({
      clientMappedId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("clientId must be a valid ObjectId")
        .required(),
      clientBranchIds: Joi.array()
        .items(
          Joi.string()
            .required()
            .pattern(/^[a-f\d]{24}$/i)
            .message("clientBranchId must be a valid Array of ObjectIds")
        )
        .required(),
      branchIds: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .message("branch Ids must be a valid Array of ObjectIds")
        )
        .optional(),
      departmentIds: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .message("departmentId must be a valid Array of ObjectIds")
        )
        .optional(),
      designationIds: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .message("designationId must be a valid Array of ObjectIds")
        )
        .optional(),
      subOrgIds: Joi.array()
        .items(
          Joi.string()
            .pattern(/^[a-f\d]{24}$/i)
            .message("subOrgId must be a valid Array of ObjectIds")
        )
        .optional(),
      category: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      attendanceStatus: Joi.boolean().optional(),
      search: Joi.string().optional(),
    }),
  },

  editClient: {
    body: Joi.object().keys({
      clientId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("clientId must be a valid ObjectId")
        .required(),
      name: Joi.string().min(3).optional(),
      orgTypeId: Joi.string()
        .optional()
        .pattern(/^[a-f\d]{24}$/i)
        .message("orgTypeId must be a valid ObjectId"),
      // panNo: Joi.string().min(10).max(10).pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).messages({
      //     'string.pattern.base': 'PAN number must be in formet of ABCDE1234A', 'string.empty': 'PAN number is required',
      // }),
      // gstNo: Joi.string().min(15).max(15).pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).messages({
      //     'string.pattern.base': 'GST number must be in formet of 07AAAAA1234A1Z5', 'string.empty': 'GST number is required',
      // }),
    }),
  },

  updateKYC: {
    body: Joi.object().keys({
      clientId: Joi.string(),
      gstNo: Joi.string()
        .required()
        .min(15)
        .max(15)
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .messages({
          "Invalid GST number":
            "GST number must be in format of 07AAAAA1234A1Z5",
          "string.empty": "GST number cannot be empty.",
        }),
      aadharNo: Joi.string()
        .required()
        .min(12)
        .max(12)
        .pattern(/^[2-9]{1}[0-9]{11}$/)
        .messages({
          "Invalid Aadhar number": "Aadhar number must be a 12-digit number",
        }),
      panNo: Joi.string()
        .required()
        .min(10)
        .max(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .messages({
          "Invalid PAN number": "PAN number must be in format of ABCDE1234A",
        }),
    }),
  },

  addClientBranch: {
    body: Joi.object().keys({
      clientId: Joi.string().required(),
      clientMappedId: Joi.string().required(),
      name: Joi.string().min(3).required(),
      address: Joi.object({
        addressTypeId: Joi.string().required(),
        hno: Joi.string().optional(),
        street: Joi.string().optional(),
        landmark: Joi.string().optional(),
        city: Joi.string().required(),
        taluk: Joi.string().optional(),
        district: Joi.string().optional(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        pincode: Joi.optional(),
      }),
      geoLocation: Joi.object({
        city: Joi.string().required(),
        district: Joi.string().optional(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        pincode: Joi.optional(),
        address: Joi.string().required(),
      }),
      geoJson: Joi.object({
        type: Joi.string().valid("Point").required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
      }),
      panNo: Joi.string()
        .min(10)
        .max(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .messages({
          "string.pattern.base": "PAN number must be in formet of ABCDE1234A",
          "string.empty": "PAN number is required",
        }),
      gstNo: Joi.string()
        .min(15)
        .max(15)
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .messages({
          "string.pattern.base":
            "GST number must be in formet of 07AAAAA1234A1Z5",
          "string.empty": "GST number is required",
        }),
    }),
  },

  addGroup: {
    body: Joi.object()
      .required()
      .keys({
        groupName: Joi.string().min(3).required(),
        orgTypeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("orgTypeId must be a valid ObjectId"),
        orgName: Joi.string().min(3).required(),
        structure: Joi.string().valid("group").optional(),
      }),
  },
  createOrg: {
    body: Joi.object()
      .required()
      .keys({
        orgTypeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("orgTypeId must be a valid ObjectId"),
        name: Joi.string().min(3).required(),
        // type: Joi.string().required(),
        // panNo: Joi.string().min(10).max(10).pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).messages({
        //     'string.pattern.base': 'PAN number must be in formet of ABCDE1234A', 'string.empty': 'PAN number is required',
        // }),
        // gstNo: Joi.string().min(15).max(15).pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).messages({
        //     'string.pattern.base': 'GST number must be in formet of 07AAAAA1234A1Z5', 'string.empty': 'GST number is required',
        // }),
        // addSubOrg:Joi.boolean().required(),
        // addBranch:Joi.boolean().required(),
        structure: Joi.string()
          .valid("branch", "organization", "group")
          .optional(),
        // address: Joi.object().optional(),
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }).when("structure", {
          is: "branch",
          then: Joi.required().messages({
            "any.required": "Address is required when structure is branch",
          }),
          otherwise: Joi.optional(),
        }),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
          address: Joi.string().required(),
        }).when("structure", {
          is: "branch",
          then: Joi.required().messages({
            "any.required": "geoLocation is required when structure is branch",
          }),
          otherwise: Joi.optional(),
        }),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).when("structure", {
          is: "branch",
          then: Joi.required().messages({
            "any.required": "geoJson is required when structure is branch",
          }),
          otherwise: Joi.optional(),
        }),
        FY: Joi.string().optional(),
      }),
  },

  updateOrg: {
    body: Joi.object()
      .required()
      .keys({
        _id: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("_id must be a valid ObjectId")
          .required(),
        name: Joi.string(),
        groupName: Joi.string(),
        // type: Joi.string(),
        orgTypeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("orgTypeId must be a valid ObjectId"),
        panNo: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
          .messages({
            "string.pattern.base": "PAN number must be in formet of ABCDE1234A",
            "string.empty": "PAN number is required",
          }),
        gstNo: Joi.string()
          .min(15)
          .max(15)
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
          .messages({
            "string.pattern.base":
              "GST number must be in formet of 07AAAAA1234A1Z5",
            "string.empty": "GST number is required",
          }),

        // address: Joi.object().optional(),
        // address: Joi.object({
        //     addressTypeId: Joi.string().required(),
        //     hno: Joi.string().optional(),
        //     street: Joi.string().optional(),
        //     landmark: Joi.string().optional(),
        //     city: Joi.string().required(),
        //     taluk: Joi.string().optional(),
        //     district: Joi.string().optional(),
        //     state: Joi.string().required(),
        //     country: Joi.string().required(),
        //     pincode: Joi.optional()
        // }).optional(),
        // geoLocation:Joi.object({
        //     city: Joi.string().required(),
        //     district: Joi.string().optional(),
        //     state: Joi.string().required(),
        //     country: Joi.string().required(),
        //     pincode:Joi.optional(),
        //     address:Joi.string().required(),
        // }),
        // geoJson:Joi.object({
        //     type:Joi.string().valid("Point").required(),
        //     coordinates:Joi.array().items(Joi.number()).length(2).required()
        // }),
        // FY:Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        // gpsL: Joi.object().optional(),
        // addSubOrg:Joi.boolean().optional(),
        // addBranch:Joi.boolean().optional()
      })
      .min(2)
      .required(),
  },

  updateShift: {
    body: Joi.object()
      .required()
      .keys({
        shiftId: Joi.string().required(),
        name: Joi.string(),
        startTime: Joi.string(),
        endTime: Joi.string(),
        isActive: Joi.bool(),
        textColor: Joi.string(),
        bgColor: Joi.string(),
        clientMappedId: Joi.string().optional(),
        clientId: Joi.string().optional(),
        minIn: Joi.string()
          .allow("")
          .pattern(/^$|^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "minIn time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
        minOut: Joi.string()
          .allow("")
          .pattern(/^$|^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "minOut time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
        maxIn: Joi.string()
          .allow("")
          .pattern(/^$|^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "maxIn time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
        maxOut: Joi.string()
          .allow("")
          .pattern(/^$|^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "maxOut time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
        reportTimeIn: Joi.string()
          .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "reportTimeIn time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
        reportTimeOut: Joi.string()
          .pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/)
          .optional()
          .messages({
            "string.pattern.base":
              "reportTimeOut time must be in the format HH:MM and between 00:00 and 23:59.",
          }),
      }),
  },
  //validation for mapping branch,dept,desg to user
  mapAllfields: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().min(3).required(),
        type: Joi.string().required(),
        panNo: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
          .messages({
            "string.pattern.base": "PAN number must be in formet of ABCDE1234A",
            "string.empty": "PAN number is required",
          }),
        gstNo: Joi.string()
          .min(15)
          .max(15)
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
          .messages({
            "string.pattern.base":
              "GST number must be in formet of 07AAAAA1234A1Z5",
            "string.empty": "GST number is required",
          }),
      }),
  },
  //validation for mapping branch,dept,desg to user
  mapAllfields: {
    body: Joi.object().required().keys({
      branchId: Joi.string().required(),
      departmentId: Joi.string().required(),
      designationId: Joi.string().required(),
      employeeUserId: Joi.string().required(),
    }),
  },
  // Validation for craeting leave policy
  createLeavePolicy: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().required().min(3),
        applicableTo: Joi.object().keys({
          roles: Joi.array().items(
            Joi.string()
              .required()
              .pattern(/^[a-f\d]{24}$/i)
              .message("roleId must be a valid ObjectId")
          ),
          departments: Joi.array().items(
            Joi.string()
              .required()
              .pattern(/^[a-f\d]{24}$/i)
              .message("departmentId must be a valid ObjectId")
          ),
        }),
        leaveTypes: Joi.array()
          .items(
            Joi.object().keys({
              leaveTypeId: Joi.string()
                .required()
                .pattern(/^[a-f\d]{24}$/i)
                .message("leaveTypeId must be a valid ObjectId"),
              maxDays: Joi.number().required().max(20),
              totalLeave: Joi.number().required().max(20),
              accural: Joi.alternatives()
                .try(Joi.string(), Joi.number())
                .required(),
            })
          )
          .required(),
      }),
  },
  //gettig userinfo details
  getUserInfoDetails: {
    body: Joi.object()
      .required()
      .keys({
        userIds: Joi.array()
          .items(
            Joi.string()
              .regex(/^[0-9a-fA-F]{24}$/)
              .required() // Ensures valid ObjectId format
          )
          .required()
          .min(1), // At least one userId is required
      }),
  },
  getUser: {
    body: Joi.object()
      .required()
      .keys({
        params: Joi.array()
          .items(Joi.string().valid(...allowed_user_params))
          .optional(),
        search: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),

        orgIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("orgIds must be array of a valid ObjectId")
          )
          .optional(),
        branchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("branchId must be array of a valid ObjectId")
          )
          .optional(),
        clientMappedIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientMappedIds must be array of a valid ObjectId")
          )
          .optional(),
        clientBranchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientBranchIds must be array of a valid ObjectId")
          )
          .optional(),
        departmentIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("departmentIds must be array of a valid ObjectId")
          ),
        designationIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("designationIds must be array of a valid ObjectId")
          ),
        employeeIds: Joi.array()
          .optional()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(
                  `"${value}" is not a valid ObjectId in employeeIds`
                );
              }
              return value;
            })
          ),
      })
      .custom((value, helpers) => {
        const hasOrg = value.orgIds && value.orgIds.length > 0;
        const hasBranch = value.branchIds && value.branchIds.length > 0;
        const hasClientMapped =
          value.clientMappedIds && value.clientMappedIds.length > 0;
        const hasClientBranch =
          value.clientBranchIds && value.clientBranchIds.length > 0;

        // Exclusive validation
        if ((hasOrg || hasBranch) && (hasClientMapped || hasClientBranch)) {
          return helpers.message(
            "You cannot provide orgIds/branchIds together with clientMappedIds/clientBranchIds in the same request."
          );
        }

        return value;
      }),
  },
  // validation for add attendance
  addAttendence: {
    body: Joi.object()
      .required()
      .keys({
        type: Joi.string().valid("checkIn", "checkOut").required(),
        transactionDate: Joi.string().isoDate().required(),
        geoJson: Joi.object()
          .required()
          .keys({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
          }),
        geoLocation: Joi.object(),
        imagePath: Joi.any().optional(),
        // clientId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientId must be a valid ObjectId').optional(),
        // clientMappedId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientId must be a valid ObjectId').optional(),
        // branchId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('branchId must be a valid ObjectId').required()
      }),
    // .custom((value, helpers) => {
    //     const { clientId, clientMappedId } = value;

    //     if (clientId && !clientMappedId) {
    //       return helpers.message('"clientMappedId" is required when "clientId" is provided');
    //     }

    //     return value;
    // }),
  },
  extendAttendence: {
    body: Joi.object()
      .required()
      .keys({
        transactionDate: Joi.string().isoDate().required(),
        geoJson: Joi.object()
          .required()
          .keys({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
          }),
        geoLocation: Joi.object(),
        imagePath: Joi.any().optional(),
        clientId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId")
          .optional(),
        clientMappedId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId")
          .optional(),
        // branchId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('branchId must be a valid ObjectId').required()
      })
      .custom((value, helpers) => {
        const { clientId, clientMappedId } = value;

        if (clientId && !clientMappedId) {
          return helpers.message(
            '"clientMappedId" is required when "clientId" is provided'
          );
        }

        return value;
      }),
  },
  teamAttendance: {
    body: Joi.object()
      .required()
      .keys({
        type: Joi.string().valid("checkIn", "checkOut").required(),
        transactionDate: Joi.string().isoDate().required(),
        geoJson: Joi.object()
          .required()
          .keys({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
          }),
        geoLocation: Joi.object(),
        imagePath: Joi.any().optional(),
        employeeId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeId must be a valid ObjectId")
          .optional(),
        shiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("shiftId must be a valid ObjectId")
          .optional(),
        clientMappedId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMapped Id must be a valid ObjectId")
          .required(),
      }),
  },

  getAttendenceStats: {
    body: Joi.object()
      .required()
      .keys({
        year: Joi.number().required(),
        month: Joi.number().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        employeeId: Joi.string().custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.message(
              `"${value}" is not a valid ObjectId in employeeId`
            );
          }
          return value;
        }),
      }),
  },

  // attendece month stastics
  monthAttendenceStats: {
    body: Joi.object()
      .required()
      .keys({
        year: Joi.number().required(),
        month: Joi.number().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        orgIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("orgIds must be array of a valid ObjectId")
          )
          .optional(),
        branchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("branchId must be array of a valid ObjectId")
          )
          .optional(),
        clientMappedIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientMappedIds must be array of a valid ObjectId")
          )
          .optional(),
        clientBranchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("clientBranchIds must be array of a valid ObjectId")
          )
          .optional(),
        departmentIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("departmentIds must be array of a valid ObjectId")
          ),
        designationIds: Joi.array()
          .optional()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("designationIds must be array of a valid ObjectId")
          ),
        employeeIds: Joi.array()
          .optional()
          .items(
            Joi.string().custom((value, helpers) => {
              if (!ObjectId.isValid(value)) {
                return helpers.message(
                  `"${value}" is not a valid ObjectId in employeeIds`
                );
              }
              return value;
            })
          ),
      })
      .custom((value, helpers) => {
        const hasOrg = value.orgIds && value.orgIds.length > 0;
        const hasBranch = value.branchIds && value.branchIds.length > 0;
        const hasClientMapped =
          value.clientMappedIds && value.clientMappedIds.length > 0;
        const hasClientBranch =
          value.clientBranchIds && value.clientBranchIds.length > 0;

        // Exclusive validation
        if ((hasOrg || hasBranch) && (hasClientMapped || hasClientBranch)) {
          return helpers.message(
            "You cannot provide orgIds/branchIds together with clientMappedIds/clientBranchIds in the same request."
          );
        }

        // At least one of orgIds or clientMappedIds is required
        if (!hasOrg && !hasBranch && !hasClientMapped) {
          return helpers.message(
            "atleast orgIds,branchIds or clientBranchIds  is required."
          );
        }

        return value;
      }),
  },

  // create quote ServiceCharge
  addQuoteServiceCharge: {
    body: Joi.object().keys({
      serviceType: Joi.string()
        //   .valid('Security', 'OtherAllowedServiceTypes') // Add all valid service types here
        .required(), // Optional for updating

      employeeLevel: Joi.string()
        //   .valid('Skilled', 'Semi-skilled', 'Unskilled') // Define allowed levels
        .optional(), // Optional for updating

      employeeType: Joi.string()
        //   .valid('Unarmed Security', 'Armed Security', 'OtherTypes') // Define allowed types
        .optional(), // Optional for updating
      experienceLevel: Joi.number().positive().optional(), // Optional for updating
      ratePerUnit: Joi.number().positive().required(), // Optional for updating

      overtimeRate: Joi.number().positive().required(), // Optional for updating

      uniformCharge: Joi.number().positive().required(), // Optional for updating

      transportCharge: Joi.number().positive().required(), // Optional for updating

      contractType: Joi.string()
        //   .valid('Hourly', 'Daily', 'Monthly','Yearly') // Define allowed project types
        .required(), // Optional for updating
    }),
  },

  // getServiceCharge
  getServiceCharge: {
    body: Joi.object().keys({
      _id: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .message("_id must be a valid ObjectId")
        .optional(), // _id is mandatory

      serviceType: Joi.string()
        //   .valid('Security', 'OtherAllowedServiceTypes') // Add all valid service types here
        .optional(), // Optional for updating

      employeeLevel: Joi.string()
        //   .valid('Skilled', 'Semi-skilled', 'Unskilled') // Define allowed levels
        .optional(), // Optional for updating

      employeeType: Joi.string()
        //   .valid('Unarmed Security', 'Armed Security', 'OtherTypes') // Define allowed types
        .optional(), // Optional for updating
      experienceLevel: Joi.number().positive().optional(), // Optional for updating
      contractType: Joi.string()
        //   .valid('Hourly', 'Daily', 'Monthly','Yearly') // Define allowed project types
        .optional(), // Optional for updating
    }),
  },

  // editServiceCharge o userRules module
  editServiceCharge: {
    body: Joi.object().keys({
      _id: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .message("_id must be a valid ObjectId")
        .required(), // _id is mandatory

      serviceType: Joi.string()
        //   .valid('Security', 'OtherAllowedServiceTypes') // Add all valid service types here
        .optional(), // Optional for updating

      employeeLevel: Joi.string()
        //   .valid('Skilled', 'Semi-skilled', 'Unskilled') // Define allowed levels
        .optional(), // Optional for updating

      employeeType: Joi.string()
        //   .valid('Unarmed Security', 'Armed Security', 'OtherTypes') // Define allowed types
        .optional(), // Optional for updating
      experienceLevel: Joi.number().positive().optional(), // Optional for updating
      ratePerUnit: Joi.number().positive().optional(), // Optional for updating

      overtimeRate: Joi.number().positive().optional(), // Optional for updating

      uniformCharge: Joi.number().positive().optional(), // Optional for updating

      transportCharge: Joi.number().positive().optional(), // Optional for updating

      projectType: Joi.string()
        //   .valid('Hourly', 'Daily', 'Monthly','Yearly') // Define allowed project types
        .optional(), // Optional for updating
    }),
  },
  // delete service charge
  deleteServiceCharge: {
    body: Joi.object().keys({
      _id: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .message("_id must be a valid ObjectId")
        .required(),
    }),
  },

  //serviceQuotePrice
  serviceQuotePrice: {
    body: Joi.object().keys({
      serviceType: Joi.string().required(), // Optional for updating

      employeeLevel: Joi.string().required(), // Optional for updating

      employeeType: Joi.string().required(), // Optional for updating
      // experienceLevel:Joi.number()
      // .positive()
      // .required(), // Optional for updating
      quotePrice: Joi.boolean().valid(true).required(), // Only accepts the value `true`,
      requiredEmployees: Joi.number()
        .positive()
        .min(1) // Ensure the value is at least 1
        .required(),
      duration: Joi.number()
        .positive()
        .min(1) // Ensure the value is at least 1
        .required(),
      overtimeHours: Joi.number().positive().required(),
      contractType: Joi.string().required(), // Optional for updating
    }),
  },

  serviceQuotePriceArray: {
    body: Joi.object({
      requirement: Joi.array()
        .items(
          Joi.object({
            serviceType: Joi.string()
              //   .valid('Security', 'OtherAllowedServiceTypes') // Add all valid service types here
              .required(),

            employeeLevel: Joi.string()
              //   .valid('Skilled', 'Semi-skilled', 'UnSkilled') // Define allowed levels
              .required(),

            quotePrice: Joi.boolean()
              .valid(true) // Only accepts the value `true`
              .required(),

            requiredEmployees: Joi.number()
              .positive()
              .min(1) // Ensure the value is at least 1
              .required(),

            duration: Joi.number()
              .positive()
              .min(1) // Ensure the value is at least 1
              .required(),

            overtimeHours: Joi.number()
              .min(0) // Overtime hours must be non-negative
              .required(),

            contractType: Joi.string()
              //   .valid('Hourly', 'Daily', 'Monthly', 'Yearly') // Define allowed project types
              .required(),
          })
        )
        .min(1) // Ensure at least one requirement is provided
        .required(),
    }),
  },

  addClientOwner: {
    body: Joi.object()
      .required()
      .keys({
        clientId: Joi.string().required(),
        _id: Joi.string().optional(),
        mobile: Joi.string()
          .min(10)
          .max(10)
          .required()
          .messages({ m: "Mobile must be of 10 degit" }),
        name: Joi.object({
          firstName: Joi.string().min(3).required(),
          lastName: Joi.string(),
        })
          .min(1)
          .required(),
        email: Joi.string().email().optional(),
        relationshipToOrg: Joi.string().optional(),
      }),
  },

  addClientKYC: {
    body: Joi.object()
      .required()
      .keys({
        clientId: Joi.string(),
        _id: Joi.string(),
        typeOfEntity: Joi.string().optional(),
        panNo: Joi.string()
          .min(10)
          .max(10)
          .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
          .messages({
            "string.pattern.base": "PAN number must be in formet of ABCDE1234A",
            "string.empty": "PAN number is required",
          }),
        gstNo: Joi.string()
          .min(15)
          .max(15)
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
          .messages({
            "string.pattern.base":
              "GST number must be in formet of 07AAAAA1234A1Z5",
            "string.empty": "GST number is required",
          }),
        // address: Joi.object().optional(),
        // gpsL: Joi.object().required(),
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
          address: Joi.string().required(),
        }),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }),
        isBranchKYC: Joi.boolean().required(),
      })
      .or("clientId", "_id"),
  },

  // vaidation for edit owner
  editClientOwner: {
    body: Joi.object().keys({
      clientId: Joi.string().required(),
      _id: Joi.string().required(),
      name: Joi.object().min(1).optional(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^\d{10}$/)
        .optional()
        .messages({
          "string.pattern.base":
            "Mobile number must contain only digits from 0 to 9",
          "string.length": "Mobile number must be exactly 10 digits",
        }),
    }),
  },

  // validations for get Clinet branch
  getBranchList: {
    body: Joi.object().keys({
      clientMappedId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },

  // validations for add branch
  addBranch: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().min(3).required(),
        clientId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId"),
        subOrgId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("subOrgId must be a valid ObjectId"),
        isDefaultOrg: Joi.boolean().optional(),
        structure: Joi.string().valid("branch").optional(),
        timeSettingType: Joi.string()
          .valid("startEnd", "reporting")
          .optional()
          .description("Determines whether time is based on start/end or a single reporting time"),

        startTime: Joi.when("timeSettingType", {
          is: "startEnd",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "startTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        endTime: Joi.when("timeSettingType", {
          is: "startEnd",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "endTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        reportingTime: Joi.when("timeSettingType", {
          is: "reporting",
          then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              "string.pattern.base": "reportingTime must be in HH:mm format",
            }),
          otherwise: Joi.forbidden(),
        }),

        maxIn: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional()
          .messages({
            "string.pattern.base": "maxIn must be in HH:mm format",
          }),

        minOut: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional()
          .messages({
            "string.pattern.base": "minOut must be in HH:mm format",
          }),

        weekOff: Joi.array()
          .items(
            Joi.string().valid(
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            )
          )
          .optional()
          .messages({
            "any.only": "weekOff must contain valid weekday names",
          }),

        // salaryCycle: Joi.number()
        //   .integer()
        //   .min(1)
        //   .max(31)
        //   .optional()
        //   .messages({
        //     "number.base": "salaryCycle must be a number between 1 and 31",
        //   }),
        
        salaryCycle: Joi.object({
          startDay: Joi.number()
            .integer()
            .min(1)
            .max(31)
            .required()
            .messages({
              "number.base": "salaryCycle.startDay must be a number between 1 and 31",
              "any.required": "salaryCycle.startDay is required"
            }),
        
          endDay: Joi.number()
            .integer()
            .min(1)
            .max(31)
            .required()
            .messages({
              "number.base": "salaryCycle.endDay must be a number between 1 and 31",
              "any.required": "salaryCycle.endDay is required"
            })
        })
        .required()
        .messages({
          "object.base": "salaryCycle must be an object with startDay and endDay"
        }),
        
        financialYear: Joi.object({
          startDate: Joi.string().required().messages({
            "date.base": "financialYear.startDate must be a valid date",
            "any.required": "financialYear.startDate is required"
          }),
          endDate: Joi.string().required().messages({
            "date.base": "financialYear.endDate must be a valid date",
            "date.greater": "financialYear.endDate must be after financialYear.startDate",
            "any.required": "financialYear.endDate is required"
          })
        })
        .required()
        .messages({
          "object.base": "financialYear must be an object with startDate and endDate"
        }),

        // panNo: Joi.string().min(10).max(10).pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).messages({
        //     'string.pattern.base': 'PAN number must be in formet of ABCDE1234A', 'string.empty': 'PAN number is required',
        // }),
        // gstNo: Joi.string().min(15).max(15).pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).messages({
        //     'string.pattern.base': 'GST number must be in formet of 07AAAAA1234A1Z5', 'string.empty': 'GST number is required',
        // }),
        // // address:Joi.object(),
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().allow('').optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().allow('').optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
          address: Joi.string().required(),
        }),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }),
      }),
  },

  // addLead: {
  //   body: Joi.object()
  //     .required()
  //     .keys({
  //       name: Joi.string().required(),
  //       orgType: Joi.string().required(),
  //       ownerName: Joi.object().keys({
  //         firstName: Joi.string().required(),
  //         lastName: Joi.string().required(),
  //       }),
  //       mobile: Joi.string().required(),
  //       email: Joi.string().optional(),
  //     }),
  // },

  addLead: {
    body: Joi.object()
      .required()
      .keys({
        companyName: Joi.string().required(),
        companayAddress: Joi.string().required(),
        contactPerson: Joi.string().required(),
        mobile: Joi.string().required(),
        contactPersonDesignation: Joi.string().optional(),
        contactPersonEmail: Joi.string().required(),
        subOrgId:Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Sub Org Id must be a valid ObjectId"),
        branchId:Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Branch Id must be a valid ObjectId"),
        assignedToId:Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("assignedToId must be a valid ObjectId"),
      
        address: Joi.object({
          addressTypeId: Joi.string().required(),
          hno: Joi.string().optional(),
          street: Joi.string().optional(),
          landmark: Joi.string().optional(),
          city: Joi.string().required(),
          taluk: Joi.string().optional(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
        }).optional(),
        geoLocation: Joi.object({
          city: Joi.string().required(),
          district: Joi.string().optional(),
          state: Joi.string().required(),
          country: Joi.string().required(),
          pincode: Joi.optional(),
          address: Joi.string().required(),
        }).optional(),
        geoJson: Joi.object({
          type: Joi.string().valid("Point").required(),
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).optional(),
        subOrgId: Joi.string().optional(),
        branchId: Joi.string().optional(),
        assignedToId: Joi.string().optional()
      })

  },
  updateLead: {
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().optional(),
        orgType: Joi.string().optional(),
        ownerName: Joi.object().keys({
          firstName: Joi.string().optional(),
          lastName: Joi.string().optional(),
        }),
        mobile: Joi.string().optional(),
        email: Joi.string().optional(),
      }),
  },
  addLeadKyc: {
    body: Joi.object()
      .required()
      .keys({
        entity: Joi.string().required(),
        leadId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Lead Id must be a valid ObjectId"),
        panNo: Joi.string(),
        // .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required().messages({
        //     'string.pattern.base': 'PAN number must be in the format AAAAA9999A',
        //     'string.empty': 'PAN number is required'
        // })
        gstinNo: Joi.string(),
        // .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).required().messages({
        //     'string.pattern.base': 'GSTIN must be in the format 11AAAAA0000A1Z1',
        //     'string.empty': 'GSTIN is required'
        // })
        address: Joi.object().keys({
          houseNo: Joi.number(),
          street: Joi.string(),
          city: Joi.string(),
          taluk: Joi.string(),
          district: Joi.string(),
          landmark: Joi.string(),
          pincode: Joi.number(),
        }),
        gpsl: Joi.object(),
        mobile: Joi.string().required(),
        email: Joi.string().optional(),
      }),
  },
  getLead: {
    body: Joi.object()
      .required()
      .keys({
        leadId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Lead Id must be a valid ObjectId"),
      }),
  },
  addLeadMeeting: {
    body: Joi.object()
      .required()
      .keys({
        leadId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("Lead Id must be a valid ObjectId"),
        meetingId: Joi.when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string()
            .required()
            .pattern(/^[a-f\d]{24}$/i)
            .message("meetingId must be a valid ObjectId"),
          otherwise: Joi.forbidden(),
        }),

        summary: Joi.string().when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string().optional(),
          otherwise: Joi.string().required(),
        }),
        meetingStatus: Joi.string().when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string().valid("Interested", "Not Interested").optional(),
          otherwise: Joi.string()
            .valid("Interested", "Not Interested")
            .required(),
        }),
        scheduledDate: Joi.string().when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string()
            .optional()
            .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
            .message({
              "string.pattern.base":
                "Date Format Should be in YYYY-MM-DDTHH:MM:SSZ",
            }),
          otherwise: Joi.string()
            .required()
            .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
            .message({
              "string.pattern.base":
                "Date Format Should be in YYYY-MM-DDTHH:MM:SSZ",
            }),
        }),
        startTime: Joi.string().when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string().optional(),
          otherwise: Joi.string().required(),
        }),
        endTime: Joi.string().when(Joi.ref("$params.type"), {
          is: "update",
          then: Joi.string().optional(),
          otherwise: Joi.string().required(),
        }),
      }),
  },

  // validations for add address type
  addressType: {
    body: Joi.object()
      .required()
      .keys({
        addressType: Joi.array().min(1).required(),
      }),
  },

  // validations for get department
  getDepartment: {
    body: Joi.object()
      .required()
      .keys({
        params: Joi.array()
          .items(Joi.string().valid(...allowed_department_params))
          .optional(),
        search: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        orgLevel: Joi.boolean().optional(),
        mapedData: Joi.string().optional().valid("department"),
        category: Joi.string().optional().valid("unassigned", "assigned"),
        departmentId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("departmentId must be a valid ObjectId"),
      }),
  },

  // validations for  get getDesignation
  getDesignation: {
    body: Joi.object()
      .required()
      .keys({
        params: Joi.array()
          .items(Joi.string().valid(...allowed_designation_params))
          .optional(),
        search: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
      }),
  },

  getUserAttendenceLogs: {
    body: Joi.object().required().keys({
      year: Joi.number().required(),
      month: Joi.number().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      // employeeId:Joi.string().required()
    }),
  },

  addPolicy: {
    body: Joi.object({
      name: Joi.string().min(3).required(),
      noOfDays: Joi.number().min(1).required(),
      cycle: Joi.object({
        type: Joi.string().valid("monthly", "yearly").required(),
        creditedDay: Joi.number().integer().min(1).max(31).when("type", {
          is: "monthly",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        creditedMonth: Joi.string()
          .valid(
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          )
          .when("type", {
            is: "yearly",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          }),

        creditedDay: Joi.number().integer().min(1).max(31).when("type", {
          is: "yearly",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }).required(),

      genderEligibility: Joi.string()
        .valid("male", "female", "other", "all")
        .required(),

      eligibleNoOfDays: Joi.number().min(0).required(),

      approval: Joi.object({
        type: Joi.string().valid("pre", "post").required(),
        applyBeforeDays: Joi.number().min(0),
        applyAfterDays: Joi.number().min(0),
      }).required(),

      isPaid: Joi.boolean().required(),
    }),
  },

  addPolicyMaster: {
    body: Joi.object({
      leavePolicyId: Joi.string().required(),

      noOfDays: Joi.number().required(),
      // eligibleNoOfDays: Joi.number().min(0).required(),

      cycle: Joi.object({
        type: Joi.string().valid("monthly", "yearly").required(),

        creditedDay: Joi.number()
          .integer()
          .min(1)
          .max(31)
          .when("type", {
            is: "monthly",
            then: Joi.required(),
            otherwise: Joi.optional()
          })
          .when("type", {
            is: "yearly",
            then: Joi.required()
          }),

        creditedMonth: Joi.string()
          .valid(
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          )
          .when("type", {
            is: "yearly",
            then: Joi.required(),
            otherwise: Joi.forbidden()
          }),
      }).required(),

      carryForwardEnabled: Joi.boolean().optional(),
      carryForwardCycle: Joi.string()
        .valid("monthly", "yearly")
        .when("carryForwardEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      salaryConversionEnabled: Joi.boolean().optional(),
      salaryConversionCycle: Joi.string()
        .valid("monthly", "yearly")
        .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      maxLeavesConvertSalary: Joi.number()
        .min(1)
        .when("salaryConversionEnabled", {
          is: true,
          then: Joi.when("salaryConversionCycle", { is: "yearly", then: Joi.required(), otherwise: Joi.forbidden() }),
          otherwise: Joi.forbidden()
        }),

      leaveEncashmentRatePerDaySalary: Joi.number()
        .min(0)
        .max(100)
        .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      //   salaryConversionBase: Joi.string()
      //     .valid("basic", "gross")
      //     .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      salaryConversionBase: Joi.string()
        .valid("basic", "gross").optional(),
      isExpiredLeaveAtMonthEnd: Joi.boolean().optional(),

      branchId: Joi.string().required(),
      departmentId: Joi.string().optional(),
      yearlyLeaveCount:Joi.number().min(1).optional(),
    })
  },

  getPolicy: {
    body: Joi.object().required().keys({
      leavePolicyId: Joi.string().optional().pattern(/^[a-f\d]{24}$/i).message('leavePolicyId must be a valid ObjectId'),
      branchId: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      search: Joi.string().optional(),
    })
  },
  updatePolicy: {
    body: Joi.object({
      _id: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message('_id must be a valid ObjectId'),

      name: Joi.string().min(3).optional(),
      noOfDays: Joi.number().min(1).optional(),

      cycle: Joi.object({
        type: Joi.string().valid("monthly", "yearly").optional(),

        creditedDay: Joi.alternatives().conditional('type', {
          is: "monthly",
          then: Joi.number().integer().min(1).max(31).optional(),
          otherwise: Joi.number().integer().min(1).max(31).optional()
        }),

        creditedMonth: Joi.alternatives().conditional('type', {
          is: "yearly",
          then: Joi.string()
            .valid(
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            )
            .optional(),
          otherwise: Joi.forbidden()
        })
      }).optional(),

      genderEligibility: Joi.string()
        .valid("male", "female", "other", "all")
        .optional(),

      eligibleNoOfDays: Joi.number().min(0).optional(),

      approval: Joi.object({
        type: Joi.string().valid("pre", "post").optional(),
        applyBeforeDays: Joi.number().min(0).optional(),
        applyAfterDays: Joi.number().min(0).optional(),
      }).optional(),

      isPaid: Joi.boolean().optional()
    })
  },
  updaatePolicyMaster: {
    body: Joi.object({
      _id: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message('_id must be a valid ObjectId'),

      name: Joi.string().min(3).optional(),
      noOfDays: Joi.number().optional(),
      // eligibleNoOfDays: Joi.number().min(0).optional(),

      cycle: Joi.object({
        type: Joi.string().valid("monthly", "yearly").optional(),

        creditedDay: Joi.number()
          .integer()
          .min(1)
          .max(31)
          .when('type', { is: 'monthly', then: Joi.optional(), otherwise: Joi.optional() })
          .when('type', { is: 'yearly', then: Joi.optional(), otherwise: Joi.optional() }),

        creditedMonth: Joi.string()
          .valid(
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          )
          .when('type', { is: 'yearly', then: Joi.optional(), otherwise: Joi.forbidden() })
      }).optional(),

      carryForwardEnabled: Joi.boolean().optional(),
      // carryForwardCycle: Joi.string()
      //   .valid("monthly", "yearly")
      //   .when("carryForwardEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),
      carryForwardCycle: Joi.string()
        .valid("monthly", "yearly")
        .when("carryForwardEnabled", {
          is: true,
          then: Joi.required().messages({
            "any.required": "carryForwardCycle is required when carryForwardEnabled is true",
            "any.only": "carryForwardCycle must be either 'monthly' or 'yearly'",
          }),
          otherwise: Joi.forbidden().messages({
            "any.unknown": "carryForwardCycle is only allowed when carryForwardEnabled is true",
          }),
        }),

      salaryConversionEnabled: Joi.boolean().optional(),
      salaryConversionCycle: Joi.string()
        .valid("monthly", "yearly")
        .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      maxLeavesConvertSalary: Joi.number()
        .min(1)
        .when("salaryConversionEnabled", {
          is: true,
          then: Joi.when("salaryConversionCycle", { is: "yearly", then: Joi.required(), otherwise: Joi.forbidden() }),
          otherwise: Joi.forbidden()
        }),

      leaveEncashmentRatePerDaySalary: Joi.number()
        .min(0)
        .max(100)
        .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      salaryConversionBase: Joi.string()
        .valid("basic", "gross")
        .when("salaryConversionEnabled", { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

      isExpiredLeaveAtMonthEnd: Joi.boolean().optional(),

      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      yearlyLeaveCount:Joi.number().min(1).optional(),
    })
  },
  //validations for activate and deactivate branch
  activateDeactivateBranch: {
    body: Joi.object().required().keys({
      clientMappedId: Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('clientMappedId must be a valid ObjectId'),
      id: Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('id  must be a valid ObjectId'),
      status: Joi.boolean().required()
    })
  },

  //validations for activate and deactivate leave policy
  activateDeactivatePolicy: {
    body: Joi.object()
      .required()
      .keys({
        _id: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("_id  must be a valid ObjectId"),
        isActive: Joi.boolean().required(),
      }),
  },

  // apply leave
  applyLeave: {
    body: Joi.object()
      .required()
      .keys({
        leavePolicyId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("leavePolicyId must be a valid ObjectId"),

        from: Joi.string().required().isoDate().messages({
          "string.isoDate": "from must be a valid ISO date",
        }),

        to: Joi.string().required().isoDate().messages({
          "string.isoDate": "to must be a valid ISO date",
        }),

        reason: Joi.string().required(),

        days: Joi.object()
          .pattern(
            Joi.string()
              .regex(/^\d{4}-\d{2}-\d{2}$/)
              .message("Each day key must be a valid YYYY-MM-DD date"),
            Joi.object({
              type: Joi.string().valid("full", "half").required(),
              paid: Joi.boolean().required(),
            })
          )
          .required(),
      })
      .custom((value, helpers) => {
        const from = new Date(value.from);
        const to = new Date(value.to);
        if (from > to) {
          return helpers.message('"from" cannot be later than "to"');
        }

        const dayKeys = Object.keys(value.days || {});
        for (const day of dayKeys) {
          const date = new Date(day);
          if (date < from || date > to) {
            return helpers.message(
              `Day ${day} in "days" is outside the range from ${value.from} to ${value.to}`
            );
          }
        }

        return value;
      }),
  },

  // validations for activate and deactivate client
  activateDeactivateClient: {
    body: Joi.object()
      .required()
      .keys({
        clientId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId"),
        status: Joi.boolean().required(),
      }),
  },

  //validations for get user leaves
  userLeaves: {
    body: Joi.object()
      .required()
      .keys({
        fromDate: Joi.string().optional().isoDate().messages({
          "string.isoDate": "fromDate must be a valid ISO date",
        }),

        toDate: Joi.string().optional().isoDate().messages({
          "string.isoDate": "toDate must be a valid ISO date",
        }),

        userLeaveId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("userLeaveId must be a valid ObjectId"),

        leavePolicyId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("leavePolicyId must be a valid ObjectId"),

        employeeId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeId must be a valid ObjectId"),

        orgIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Each subOrgId must be a valid ObjectId")
          )
          .optional(),

        branchIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Each branchId must be a valid ObjectId")
          )
          .optional(),

        departmentIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("Each departmentId must be a valid ObjectId")
          )
          .optional(),
        status:Joi.string().optional(),
        limit: Joi.number().optional(),
        page: Joi.number().optional(),
        status:Joi.string().optional(),
      })
      .custom((value, helpers) => {
        if (value.fromDate && value.toDate) {
          const from = new Date(value.fromDate);
          const to = new Date(value.toDate);
          if (from > to) {
            return helpers.message('"fromDate" cannot be later than "toDate"');
          }
        }
        return value;
      }),
  },

  // validations for get user leave balance
  userLeaveBalance: {
    body: Joi.object()
      .required()
      .keys({
        leavePolicyId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("leavePolicyId must be a valid ObjectId"),

        employeeId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeId must be a valid ObjectId"),
      }),
  },

  // validations for approve reject leave
  updateApproveRejectLeave: {
    body: Joi.object()
      .required()
      .keys({
        leavePolicyId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("leavePolicyId must be a valid ObjectId"),

        employeeId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeId must be a valid ObjectId"),

        userLeaveId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("userLeaveId must be a valid ObjectId"),

        from: Joi.string().required().isoDate().messages({
          "string.isoDate": "from must be a valid ISO date",
        }),

        to: Joi.string().required().isoDate().messages({
          "string.isoDate": "to must be a valid ISO date",
        }),

        days: Joi.object()
          .required()
          .pattern(
            Joi.string()
              .regex(/^\d{4}-\d{2}-\d{2}$/)
              .message("Each day key must be in YYYY-MM-DD format"),
            Joi.object({
              type: Joi.string().valid("full", "half").required(),
              paid: Joi.boolean().required(),
              status: Joi.string()
                .valid("approved", "rejected", "pending")
                .required(),
              remarks: Joi.string().allow("", null).optional(),
              // approvedBy: Joi.string().optional(),
              approvedBy: Joi.optional(),
              approvedAt: Joi.string().isoDate().optional(),
            })
          ),
      })
      .custom((value, helpers) => {
        const from = new Date(value.from);
        const to = new Date(value.to);

        if (from > to) {
          return helpers.message('"from" cannot be later than "to"');
        }

        const dayKeys = Object.keys(value.days || {});
        for (const day of dayKeys) {
          const date = new Date(day);
          if (date < from || date > to) {
            return helpers.message(
              `Day "${day}" is outside the range from "${value.from}" to "${value.to}"`
            );
          }
        }

        return value;
      }),
  },

  approveRejectAttendence: {
    body: Joi.object()
      .required()
      .keys({
        employeeId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeId must be a valid ObjectId"),
        shiftId: Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .message("shiftId must be a valid ObjectId")
          .required(),
        approvalStatus: Joi.boolean().required(),
        remarks: Joi.string().optional(),
        transactionDate: Joi.string().required().isoDate().messages({
          "string.isoDate": "date must be a valid ISO date",
        }),
      }),
  },

  assignRoleToDesignation: {
    body: Joi.object({
      designationId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("designationId must be a valid ObjectId"),

      //   roles: Joi.array()
      //     .items(
      //       Joi.string()
      //         .pattern(/^[a-f\d]{24}$/i)
      //         .message('roleId must be a valid ObjectId')
      //     )
      //     .min(1)
      //     .required(),
      roles: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("roleId must be a valid ObjectId"),

      endpoint: Joi.string().optional(),
      ModuleKey: Joi.string().optional(),
      IP: Joi.string().optional(),
    }).required(),
  },

  getDesignationRolesModules: {
    body: Joi.object()
      .required()
      .keys({
        employeeUserId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("employeeUserId must be a valid ObjectId"),
        module:Joi.string().optional()
      }),
  },
  activateDeactivateShift: {
    body: Joi.object()
      .required()
      .keys({
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
        shiftId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("shiftId must be a valid ObjectId"),
        isActive: Joi.boolean().required(),
      }),
  },

  updateDisableModules: {
    body: Joi.object({
      employeeId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("employeeId must be a valid ObjectId"),

      disabledModules: Joi.array()
        .required()
        .items(
          Joi.object({
            moduleId: Joi.string()
              .required()
              .pattern(/^[a-f\d]{24}$/i)
              .message("moduleId must be a valid ObjectId"),

            permissions: Joi.array()
              .items(Joi.string().valid("c", "r", "u", "d"))
              .default([]), // optional, defaults to empty array
          })
        ),
    }),
  },

  addBanner: {
    body: Joi.object()
      .required()
      .keys({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        imagePath: Joi.any().optional(),
        // clientMappedId: Joi.string().pattern(/^[a-f\d]{24}$/i).message('clientMapped Id must be a valid ObjectId').required(),
        startDate: Joi.string().optional().isoDate().messages({
          "string.isoDate": "startDate must be a valid ISO date",
        }),
        endDate: Joi.string().optional().isoDate().messages({
          "string.isoDate": "endDate must be a valid ISO date",
        }),
        time: Joi.string()
          .optional()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
          .message("time must be in HH:MM 24-hour format"),
      }),
  },

  addEmergecyContacts: {
    body: Joi.object()
      .required()
      .keys({
        clientMappedId: Joi.string().optional(),
        clientId: Joi.string().optional(),
        contacts: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              // relation: Joi.string().required(),
              mobile: Joi.string()
                .pattern(/^\d{1,10}$/)
                .required()
                .messages({
                  "string.pattern.base":
                    "Mobile number must contain only digits (0–9)",
                }),
              //     altMobile: Joi.string().length(10).pattern(/^\d{10}$/).optional().allow(null, '').messages({
              //         'string.pattern.base': 'Alt Mobile number must contain only digits from 0 to 9',
              //         'string.length': 'Alt Mobile number must be exactly 10 digits',
              //       }),
              //     email: Joi.string().email().optional().allow(null, ''),
              //     address: Joi.string().optional().allow(null, ''),
              //     pincode: Joi.string().optional().allow(null, ''),
              //     state: Joi.string().optional().allow(null, ''),
              //     country: Joi.string().optional().allow(null, ''),
            })
          )
          .min(1)
          .required(),
      }),
  },
  getEmergencyContacts: {
    body: Joi.object().required().keys({
      clientMappedId: Joi.string().optional(),
      clientId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },

  updateEmergencyContacts: {
    body: Joi.object()
      .required()
      .keys({
        emergencyContactId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("_id must be a valid ObjectId"),
        contacts: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            serialNo: Joi.number().required(),
            // relation: Joi.string().required(),
            mobile: Joi.string()
              .pattern(/^\d{1,10}$/)
              .required()
              .messages({
                "string.pattern.base":
                  "Mobile number must contain only digits (0–9)",
              }),
          })
        ),
      }),
  },

  clientReportTimeSettings: {
    body: Joi.object()
      .required()
      .keys({
        // reportTimeIn: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
        //     'string.pattern.base': 'minIn time must be in the format HH:MM and between 00:00 and 23:59.'
        // }),
        // reportTimeOut: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
        //     'string.pattern.base': 'minOut time must be in the format HH:MM and between 00:00 and 23:59.'
        // }),
        isReportTime: Joi.boolean().required(),
        clientId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId"),
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
      }),
  },
  getClientReportTimeSettings: {
    body: Joi.object()
      .required()
      .keys({
        clientId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId"),
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
      }),
  },
  updateClientReportTimeSettings: {
    body: Joi.object()
      .required()
      .keys({
        clientId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientId must be a valid ObjectId"),
        clientMappedId: Joi.string()
          .optional()
          .pattern(/^[a-f\d]{24}$/i)
          .message("clientMappedId must be a valid ObjectId"),
        // reportTimeIn: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
        //     'string.pattern.base': 'minIn time must be in the format HH:MM and between 00:00 and 23:59.'
        // }),
        // reportTimeOut: Joi.string().pattern(/^((0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]|24:00)$/).required().messages({
        //     'string.pattern.base': 'minOut time must be in the format HH:MM and between 00:00 and 23:59.'
        // }),
        isReportTime: Joi.boolean().required(),
        settingReportId: Joi.string()
          .required()
          .pattern(/^[a-f\d]{24}$/i)
          .message("settingReportId must be a valid ObjectId"),
      }),
  },

  getUserClients: {
    body: Joi.object()
      .required()
      .keys({
        employeeIds: Joi.array()
          .items(
            Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .message("employeeId must be a valid ObjectId")
          )
          .min(1)
          .required(),
      }),
  },

  updateBranchBoundary: {
    body: Joi.object().required().keys({
      branchId: Joi.string().required().pattern(/^[a-f\d]{24}$/i).message('branch Id must be a valid ObjectId'),
      subOrgId: Joi.string().optional().pattern(/^[a-f\d]{24}$/i).message('subOrg Id must be a valid ObjectId'),
      clientMappedId: Joi.string().optional().pattern(/^[a-f\d]{24}$/i).message('clientMappedId must be a valid ObjectId'),
      geoBoundary: Joi.object({
        type: Joi.string().valid("Polygon").required(),
        coordinates: Joi.array()
          .items(
            Joi.array().items(
              Joi.array().items(Joi.number()).length(2) // [lng, lat]
            ).min(4) // at least 4 coords (3 unique + repeat)
          )
          .min(1)
          .required()
      }).required()
    })
  }
  ,
  addOvertime: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().valid("Holiday", "Daily", "Week Off").required(), // if only "Holiday" allowed
    amount: Joi.number().positive().required(),
    type: Joi.string().required(), // if only this value allowed
    minHours: Joi.number().integer().min(0).required(),
    maxHours: Joi.number().integer().min(Joi.ref("minHours")).required()
  }),
  addLeavePolicyDropddown: {
    body: Joi.object().required().keys({
      policyName: Joi.string().trim().min(1).required()
    })
  },

  listQuoteStandardPrice: {
    body: Joi.object({
      designationId: Joi.string().optional(),
      subOrgId: Joi.string().optional(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      date: Joi.string().optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional()
    })
  },

  // Update quote price validation
  updateStandardQuotePrice: {
    body: Joi.object({
      baseQuotePriceId: Joi.string().required(),
      designationId: Joi.string().required(),
      daily: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        })
      }).optional(),
      monthly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        })
      }).optional(),
      yearly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required(),
        })
      }).optional(),
      effectiveFrom: Joi.string().optional(),
      adjustment: Joi.object().optional()
    })
  },

  // Get quote prices by designation
  getQuotePricesByDesignation: {
    body: Joi.object({
      designationId: Joi.string().optional(),
      subOrgId: Joi.string().optional(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      date: Joi.string().optional()
    }),
    // params: Joi.object({
    //   designationId: Joi.string().when('body.designationId', {
    //     is: Joi.exist(),
    //     then: Joi.optional(),
    //     otherwise: Joi.required()
    //   })
    // }).optional()
  },

  // Modify branch quote price
  modifyBranchQuotePrice: {
    body: Joi.object({
      designationId: Joi.string().required(),
      baseQuotePriceId: Joi.string().optional(),
      priceId: Joi.string().optional(),
      subOrgId: Joi.string().optional(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      daily: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).required(),
      monthly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).required(),
      yearly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).required(),
      effectiveFrom: Joi.string().optional(),
      adjustment: Joi.object().optional()
    })
  },

  // Update branch quote price
  updateBranchQuotePrice: {
    body: Joi.object({
      designationId: Joi.string().required(),
      baseQuotePriceId: Joi.string().required(),
      priceId: Joi.string().required(),
      subOrgId: Joi.string().optional(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      daily: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).optional(),
      monthly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).optional(),
      yearly: Joi.object({
        male: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          cityLimit: Joi.number().min(0).required(),
          outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required()
        })
      }).optional(),
      effectiveFrom: Joi.string().optional(),
      adjustment: Joi.object().optional()
    })
  },

  // Get branch quote prices comparison
  getBranchQuotePricesComparison: {
    body: Joi.object({
      designationId: Joi.string().optional(),
      subOrgId: Joi.string().optional(),
      branchId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      date: Joi.string().optional()
    }).custom((value, helpers) => {
      // At least one branch identifier is required
      if (!value.subOrgId && !value.branchId && !value.departmentId) {
        return helpers.error('any.custom', {
          message: 'At least one branch identifier (subOrgId, branchId, or departmentId) is required'
        });
      }
      return value;
    })
  },

  // Get branch quote prices
  getBranchQuotePrices: {
    params: Joi.object({
      branchId: Joi.string().required()
    }),
    body: Joi.object({
      designationId: Joi.string().optional(),
      subOrgId: Joi.string().optional(),
      departmentId: Joi.string().optional(),
      date: Joi.string().optional()
    })
  },
  addStandardQuotePrice: {
    body: Joi.object({
      designationId: Joi.string().required(),
      baseQuotePriceId: Joi.string().allow(null).optional(),
      daily: Joi.object({
        male: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        })
      }).optional(),
      monthly: Joi.object({
        male: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        })
      }).optional(),
      yearly: Joi.object({
        male: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        }),
        female: Joi.object({
          // cityLimit: Joi.number().min(0).required(),
          // outCityLimit: Joi.number().min(0).required(),
          dayShift: Joi.number().min(0).required(),
          nightShift: Joi.number().min(0).required(),
          outCityDayShift: Joi.number().min(0).required(),
          outCityNightShift: Joi.number().min(0).required()
        })
      }).optional(),
      effectiveFrom: Joi.date().iso().optional(),
      adjustment: Joi.object({
        type: Joi.string().valid('fixed', 'percentage').required(),
        value: Joi.number().required()
      }).optional()
    })
  },

  //generate quotation
  genrateQuotation: {
    body: Joi.object({
      // Required: Lead identifier (24-character ObjectId)
      leadId: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .required()
        .messages({
          "string.pattern.base": "leadId must be a valid ObjectId",
          "any.required": "leadId is required"
        }),
      quotationId: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .optional()
        .messages({
          "string.pattern.base": "quotation Id must be a valid ObjectId",
        }),

      // Optional: Quotation date (YYYY-MM-DD or omitted)
      quotationDate: Joi.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
        .messages({
          "string.pattern.base": "quotationDate must be in yyyy-mm-dd format",
        }),

      // Required: Subscription type
      subscriptionType: Joi.string()
        .valid('daily', 'monthly', 'yearly')
        .required()
        .messages({
          "any.only": "subscriptionType must be one of [daily, monthly, yearly]",
          "any.required": "subscriptionType is required"
        }),

      // Required: Array of requirements
      requirements: Joi.array()
        .items(
          Joi.object({
            // Required: Base quote price identifier
            baseQuotePriceId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .required()
              .messages({
                "string.pattern.base": "baseQuotePriceId must be a valid ObjectId",
                "any.required": "baseQuotePriceId is required"
              }),

            // Required: Price identifier
            priceId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .required()
              .messages({
                "string.pattern.base": "priceId must be a valid ObjectId",
                "any.required": "priceId is required"
              }),

            // Required: Designation identifier
            designationId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .required()
              .messages({
                "string.pattern.base": "designationId must be a valid ObjectId",
                "any.required": "designationId is required"
              }),

            refernceId: Joi.string()
              .pattern(/^[a-f\d]{24}$/i)
              .optional()
              .messages({
                "string.pattern.base": "designationId must be a valid ObjectId",
                "any.required": "refernceId is required"
              }),
            // Required: Number of positions (minimum 1)
            noOfPositions: Joi.number()
              .integer()
              .min(1)
              .required()
              .messages({
                "number.base": "noOfPositions must be a number",
                "number.min": "noOfPositions must be at least 1",
                "any.required": "noOfPositions is required"
              }),

            // Required: Gender specification
            gender: Joi.string()
              .valid('male', 'female')
              .required()
              .messages({
                "any.only": "gender must be either 'male' or 'female'",
                "any.required": "gender is required"
              }),

            // Required: Price (minimum 0)
            price: Joi.number()
              .min(0)
              .required()
              .messages({
                "number.base": "price must be a number",
                "number.min": "price must be greater than or equal to 0",
                "any.required": "price is required"
              }),

            // Required: City limit
            limits: Joi.string()
              .valid('cityLimit', 'outCityLimit')
              .required()
              .messages({
                "any.only": "limits must be either 'cityLimit' or 'outCityLimit'",
                "any.required": "limits is required"
              }),

            // Required: Shift type
            shiftType: Joi.string()
              .valid("dayShift", "nightShift")
              .required()
              .messages({
                "any.only": "shiftType must be either 'dayShift' or 'nightShift'",
                "any.required": "shiftType is required"
              }),
             duration:Joi.number()
             .required()
          })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "requirements must be an array",
          "array.min": "requirements must contain at least 1 item",
          "any.required": "requirements is required"
        })
    })
  },

  designationDisabledModules: {
    body: Joi.object({
      designationId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("designationId must be a valid ObjectId"),

      disabledModules: Joi.array()
        .required()
        .items(
          Joi.object({
            moduleId: Joi.string()
              .required()
              .pattern(/^[a-f\d]{24}$/i)
              .message("moduleId must be a valid ObjectId"),

            permissions: Joi.array()
              .items(Joi.string().valid("c", "r", "u", "d"))
              .default([]), // optional, defaults to empty array
          })
        ),
    }),
  },
 
  designationModules: {
    body: Joi.object({
      designationId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("designationId must be a valid ObjectId"),
      module:Joi.string().optional()
    }),
  },
  extendAdd: {
    body: Joi.object({
      branchId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("branchId must be a valid ObjectId"),
      shiftId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("shiftId must be a valid ObjectId"),
      clientMappedId: Joi.string()
        .optional()
        .pattern(/^[a-f\d]{24}$/i)
        .message("clientMappedId must be a valid ObjectId"),
      date: Joi.string().required(),
      remarks : Joi.string().optional()
    }),
  },
  updateExtendStatus: {
    body: Joi.object({
      extensionId: Joi.string()
        .required()
        .pattern(/^[a-f\d]{24}$/i)
        .message("extensionId must be a valid ObjectId"),
      status: Joi.string().optional().valid('pending', 'approve', 'reject'),
      remarks: Joi.string().optional()
    }),
  },
  extendList: {
    body: Joi.object({
      limit: Joi.number().optional(),
      page: Joi.number().optional(),
      status: Joi.string().optional().valid('pending', 'approve', 'reject','Pending', 'Approve', 'Reject'),
      startDate: Joi.string().optional(),
      endDate: Joi.string().optional(),
    }),
  },


}