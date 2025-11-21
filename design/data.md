>server sql:
- company_t  {(id),name}                                                            
- user_t     {(id),name,password,key}   key use (npm uuid), will be for inviting

>manager's company SQL(each company 1 database)
- transaction
    - item_t            {(id),name}
    - transaction_t     {(date,hour, user_id),item_id,count}  //one account
    - stock_t           {(date,item_id),price,count}  at date x, use the newest price before or at date x
- inventory
    <!-- - resource_t            { (id), name, measurement } // measurement refer to the unit of measurement  -->
    <!-- - resource_quantity_t   { (date, resource_id), count } // track actual quantity? or track changes? -->
    <!-- - resource_cost_t       { (date, resource_id), cost } // cost is per measurement -->
    <!-- - composition_t         { (item_id, resource_id), resouce_count } -->


>client:
- input configuration setting

since there is only one account, it will only have one icon