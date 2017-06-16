
const userMap = session_js.tableMap('users')
.columnMap('id', 'id', {isAutoIncrement: true})
.columnMap('uName','username')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('roll', "userType")
.columnMap('email','email')
.columnMap('updateP','updateP')
.columnMap('date', "time", {isAutoIncrement: true});

const tempuserMap = session_js.tableMap('tempuser')
.columnMap('id', 'id')
.columnMap('uName','username')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('email','email');