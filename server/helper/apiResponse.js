export function successResponse (res, msg) {
	var responseData = {
		status: 200,
		message: msg
	};
	logResponse(responseData)
	return res.status(200).json(responseData);
}



export function partialSuccessResponse (res, msg) {
	var responseData = {
		status: 206,
		message: msg
	};
	logResponse(responseData)
	return res.status(206).json(responseData);
}




export function successResponseWithData (res, msg, data) {
	var responseData = {
		status: 200,
		message: msg,
		data: data
	};
	logResponse(responseData)
	return res.status(200).json(responseData);
}



export function ErrorResponse (res, msg, err) {
	var responseData = {
		status: 500,
		message: msg,
		Error:err
	};
	logResponse(responseData)
	return res.status(500).json(responseData);
}

export function notFoundResponse (res, msg, data = {}) {
	var responseData = {
		status: 404,
		message: msg
	};
	logResponse(responseData)
	return res.status(404).json(responseData);
}

export function validationErrorWithData (res, msg, data) {
	var responseData = {
		status: 400,
		message: msg,
		data: data
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
}

export function validationError (res, msg) {
	var responseData = {
		status: 400,
		message: msg
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
}

export function unauthorizedResponse (res, msg) {
	var responseData = {
		status: 401,
		message: msg,
	};
	logResponse(responseData)
	return res.status(401).json(responseData);
}
export function duplicateResponse (res, msg) {
	var responseData = {
		status: 409,
		message: msg,
	};
	logResponse(responseData)
	return res.status(responseData.status).json(responseData);
}

export function customResponse (res, msg, data, info) {
	var responseData = {
		status: 400,
		message: msg,
		data:data,
		info,
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
}
export function somethingResponse (res,info) {
	var responseData = {
		status: 400,
		message: "Something went wrong! Please try again later.",
		info
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
}
export function responseWithPagination (res,msg,data){
	const responseData = {
		status:200,
		message:msg,
		totalRecord:data?.totalRecord,
		nextPage:data?.next_page,
		data:data?.data,
		references:data?.references,
		currentPageItemsCount:data?.data?.length || 0,
	};

	return res.status(200).json(responseData);
}

function logResponse(responseData){
	// console.error("\x1B[36m"+JSON.stringify(responseData, null, 2)+"\x1B[39m")
	console.error("=======================================================\n");
}