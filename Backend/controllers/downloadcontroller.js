const sequelize = require('../config/db');
const Expenses = require('../model/expense');
const Signup = require('../model/signup');
const {DownloadList}= require('../model/filedownload')
const AWS = require("aws-sdk")
exports.download = async(req,res)=>{
    try {
        const expenses = await req.result.getExpenses();
        
        
        const stringifiedExpense = JSON.stringify(expenses);
        const userId = req.result.id;
        const fileName = `Expense${userId}/${new Date().toISOString()}.txt`;
    
        const uploadToS3 = (data, filename) => {
          const s3bucket = new AWS.S3({
            accessKeyId: aws_access_key,
            secretAccessKey: aws_access_key_secret,
           
          });
    
          const params = {
            Bucket: bucket_name,
            Key: filename,
            Body: data,
            ACL: 'public-read',
          };
    
          return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res.Location);
              }
            });
          });
        };
    
        const fileURL = await uploadToS3(stringifiedExpense, fileName);
    
       
        const createDownloadRecord = async (fileName, fileURL, userId) => {
          return await DownloadList.create({ fileName, fileURL, SignupId:userId });
        };
    
        
        await createDownloadRecord(fileName, fileURL,userId);
    
        res.status(200).json({ fileURL, success: true });
      } catch (err) {
        console.error('Error in /expense/download:', err);
        res.status(500).json({
          success: false,
          message: 'An error occurred while processing the request.',
        });
      }
}

exports.downloads = async(req,res)=>{
    try{
        const result = await DownloadList.findAll({where:{SignupId:req.result.id}})
        res.status(201).json(result)
       
    } 
    catch(error){
        res.status(500).json({message:error.message})
    }
}