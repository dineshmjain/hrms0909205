export const generateRedisKey = (query) => {
    let key = `${query.orgId}`;
    if (query.branchId) key += `:branch:${query.branchId}`;
    if (query.departmentId) key += `:department:${query.departmentId}`;
    if (query.designationId) key += `:designation:${query.designationId}`;
    if (query.clientId) key += `:clientId:${query.clientId}`;
    if(query.id) key += `:userId:${query.id}`;
    // if (query.assignment) key += `:assignment:${query.assignment}`;
    return key;
};


export const generateServiceChargeKey = (query) => {
    if (!query.requirement || !Array.isArray(query.requirement)) {
        throw new Error("Invalid input: 'requirement' should be an array.");
    }

    // Iterate over each requirement and generate a key
    return query.requirement.map((req, index) => {
        const { serviceType, employeeLevel, contractType, requiredEmployees, duration, overtimeHours } = req;

        // Construct the key for each requirement
        // let key = `requirement:${index}`;
        let key = `orgId:${query.user.orgId}`;
        if (serviceType) key += `:serviceType:${serviceType}`;
        if (employeeLevel) key += `:employeeLevel:${employeeLevel}`;
        if (contractType) key += `:projectType:${projectType}`;
       

        return key;
    });
};