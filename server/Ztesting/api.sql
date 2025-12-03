use test_db;
select "result"\G;
show tables;

desc company_t;
desc user_t;
desc item_t;
desc stock_t;
desc transaction_t;


select "---------------data Dump-------------" \G;
select 
    id as _company_id,
    name
from company_t;
select
    name as _user_name,
    company_id,
    isManager,
    LEFT(password,10)
from user_t;
select 
    id as _item_id,
    company_id,
    name,
    stock,
    LEFT(Hex(image),20)
from item_t;
select
    time as _transaction_time,
    company_id,
    item_id,
    count
    
from transaction_t;
select
    time as _price_time,
    company_id,
    item_id,
    price
from price_t;
    


--------- /stock_page/update_limitation


--------- /transaction_page/cart_page


--------- /transaction_page/post_transaction
--------- /transaction_page/fetch_transaction_history
--------- /navigation/export
--------- /summary_page/high_level
--------- /summary_page/log

-- insert into company_t (name) values ("the Company");
-- insert into user_t values (1,false,"theCompany_cashier","mypassword");


