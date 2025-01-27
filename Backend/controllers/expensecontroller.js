const sequelize = require('../config/db');
const Expenses = require('../model/expense');
const Signup = require('../model/signup');

// exports.checking_auth = async(req,res)=>{
//     try{
//       res.status(200).json({message:"token matched"},{success:true})
//     }
//     catch{
//       res.status(401).json({message:"token not matched"},{sucess:false})
//     }
// }

exports.addExpense = async (req, res) => {
    const { expenseAmount, description, category } = req.body;
    const unique_id = req.result.id;

    const transaction = await sequelize.transaction();

    try {
        const totalExpense = Number(req.result.totalExpense) + Number(expenseAmount);

        const result = await Expenses.create(
            { expenseAmount, description, category, SignupId: unique_id },
            { transaction }
        );

        await Signup.update(
            { totalExpense },
            { where: { id: unique_id },transaction },
            
        );

        await transaction.commit();
        res.status(201).json(result);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};



exports.getExpenses = async (req, res) => {
    try {
   
      const { page = 1, items } = req.query;
  
      const pageNumber = parseInt(page, 10); 
      const itemsPerPage = parseInt(items, 10);
  

  
      const userId = req.result.id; 
      const offset = (pageNumber - 1) * itemsPerPage; 
      const ispremium = await Signup.findOne({where:{id:userId}})
  
      const expensesData = await Expenses.findAndCountAll({
        where: { SignupId: userId }, 
        limit: itemsPerPage, 
        offset, 
        order: [['createdAt', 'DESC']], 
      });
  
      const expenses = expensesData.rows; 
      const totalExpenses = expensesData.count; 
      const totalPages = Math.ceil(totalExpenses / itemsPerPage); 
  
     
      res.status(200).json({
        expenses,
        pagination: {
          totalExpenses,
          totalPages,
          currentPage: pageNumber,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
        is_premium:ispremium.Ispremium
      });
    } catch (err) {
      
      res.status(500).json({
        msg: 'Failed to fetch expenses. Please try again.',
      });
    }
  };
  


exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const unique_id = req.result.id;

    const transaction = await sequelize.transaction();

    try {
        const expense = await Expenses.findOne({ where: { id, SignupId: unique_id } });

        if (!expense) {
            await transaction.rollback();
            return res.status(404).json({ message: "Expense not found" });
        }

        const deletedRows = await Expenses.destroy({
            where: { id, SignupId: unique_id },
            transaction,
        });
        if(!deletedRows){
            await transaction.rollback();
            return res.status(403).json({message:"No row found"})
        }

        const updatedTotalExpense = Number(req.result.totalExpense) - Number(expense.expenseAmount);
        await Signup.update(
            { totalExpense: updatedTotalExpense },
            { where: { id: unique_id }, transaction }
        );

        await transaction.commit();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};
