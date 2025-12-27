use test_db;
select "result"\G;
show tables;

desc company_t;
desc user_t;
desc item_t;
desc stock_t;
desc transaction_t;
-- ---------------data generation---------------------------


select "------------specific code-------------" \G;

set @company_id = 1;


-- select * from stock_t where company_id=@company_id;

-- select 
--     id as _item_id,
--     company_id,
--     name,
--     currentStock,
--     expiry
-- from item_t
-- where isnull(expiry) 
;

-- insert into item_t (company_id,name,expiry) values 
--     (@company_id,'kkkkk',now()), 
--     (@company_id,'aaa',now()), 
--     (@company_id,'bbb',now()), 
--     (@company_id,'ccc',now())
-- returning 
--     expiry
-- ;

select 
    i.id,
    -- s.price,
    i.name
from (
    select * from item_t
    where 
        company_id = @company_id
) as i
-- left join (
--     select 
--         *, 
--         max(time) over(
--             partition by item_id
--         ) as recent
--     from stock_t 
--     where 
--         company_id = @company_id
-- ) as s
-- on i.id = s.item_id 
-- where s.time = s.recent
;


-- update item_t set expiry = now() where id = 1;


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
    currentStock,
    expiry,
    LEFT(Hex(image),20)
from item_t;
select
    time as _transaction_time,
    company_id,
    item_id,
    count
    
from transaction_t;
select
    time as _stock_time,
    company_id,
    item_id,
    price,
    stock
from stock_t;
    


--------- /stock_page/update_limitation


--------- /transaction_page/cart_page


--------- /transaction_page/post_transaction
--------- /transaction_page/fetch_transaction_history
--------- /navigation/export
--------- /summary_page/high_level
--------- /summary_page/log

-- insert into company_t (name) values ("the Company");
-- insert into user_t values (1,false,"theCompany_cashier","mypassword");


