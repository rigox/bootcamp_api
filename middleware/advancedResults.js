



const advancedResults  =  (model,populate)=> async(req,res,next)=>{

    let query;
  

   //copy req.query
   const reqQuery  = {...req.query}; 
    //Fields to exclude

    const removeFields = ['select','sort','page','limit'];
  
     //Loop over remove fields and delete the from request requery

     removeFields.forEach(param => delete reqQuery[param]);
   
   console.log(reqQuery)
   // Create Query Str
   let queryStr = JSON.stringify(reqQuery)
   
   //create Operators
   queryStr =  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)
    
 

   // finding resource 
   query  =  model.find(JSON.parse(queryStr));
   
    // Select fields
    if(req.query.select){
        
        fields =  req.query.select.split(',').join(' ');
        query =  query.select(fields)
   }

   // Sort Fields
   if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query  = query.sort(sortBy)
   }else{
         query = query.sort('-createdAt')
   }

   //Pagination
   const page  =  parseInt(req.query.page,10) || 1 ;
   const limit = parseInt(req.query.limit,10) || 1;
   const startIndex  = (page-1)*limit;
   const endIndex  = page * limit;
   const total =  await model.countDocuments();
   query  =  query.skip(startIndex).limit(limit);
   
    if(populate){
        query =  query.populate(populate)
    }




   console.log(queryStr)
          //Executing query
          const results =  await  query;

          //Paginationn results
          const pagination = {} ;
          if(endIndex<total){
              pagination.next ={
                   page: page+1,
                   limit
              }
          }

          if(startIndex > 0){
               pagination.prev ={
                   page: page-1,
                   limit
               }
          }

          res.advancedResults = {
               success:true,
               count: results.length,
               pagination,
               data: results
          }
     next();
}


module.exports =  advancedResults;