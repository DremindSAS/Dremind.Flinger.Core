FormHub = function () {
	this._privateVariable = 10;
	this._dependencies = {};
};

FormHub.prototype = function () {
	var privateMethod = function () {
		console.log('Inside a private method!');
		this._privateVariable++;
	}

	var methodToExpose = function () {
		console.log('This is a method I want to expose!');
	}

	var otherMethodIWantToExpose = function () {
		privateMethod();
	}

	return {
		first: methodToExpose,
		second: otherMethodIWantToExpose
	}
}();

Services.FormHub = new FormHub();

delete FormHub;