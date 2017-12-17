const                         r = require,
serverConst             = r('./auth.js'),

Sequelize = r('sequelize');
const sequelize = new Sequelize(serverConst.database, serverConst.user, serverConst.password, {
  host: 'localhost',
  dialect: 'mysql',
    // define: {
    //     timestamps: false
    // },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
 



  module.exports = models = {
  	User : sequelize.define('users', {
  username:
   Sequelize.STRING,
  
  firstName: 
   Sequelize.STRING,
  
  lastName: 
   Sequelize.STRING,

  password:
   Sequelize.STRING,
  
  email:
   Sequelize.STRING,

  userType: 
  Sequelize.STRING,

  updateP:
    Sequelize.STRING,
  
  time:
    Sequelize.DATE
   },{

    // I don't want createdAt and updateAt 
  createdAt: false,
  timestamps: false,
  updatedAt: false
   }),
  Tuser : sequelize.define('tempuser', {
  

  userName:
   Sequelize.STRING,
  
  firstName: 
   Sequelize.STRING,
  
  lastName: 
   Sequelize.STRING,

  password:
   Sequelize.STRING,
  
  email:
   Sequelize.STRING,
  userType: Sequelize.STRING
   },{

    // I don't want createdAt and updateAt 
  createdAt: false,
  timestamps: false,
  updatedAt: false
   }),

  image : sequelize.define('dd', {
  	name:
   Sequelize.STRING,
   path:
   Sequelize.STRING,
   type:
   Sequelize.STRING,
   user: {
              type: Sequelize.INTEGER,
                   // references: { model: 'users', key: 'id' }

        },
  },{
  	createdAt: false,
  timestamps: false,
  updatedAt: false
  }),


   comment : sequelize.define('comment', {
  	text:
   Sequelize.STRING ,
   comment_auther: {

  type: Sequelize.INTEGER,
  // references: { model: 'users', key: 'id' }
   }
   
  },{
  	createdAt: false,
  timestamps: false,
  updatedAt: false
  }),

  }



