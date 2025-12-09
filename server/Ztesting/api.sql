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


-- select time, item_id, count
-- from transaction_t
-- where 
--     company_id = 1 and
--     time in (
        
--     )

-- top 5 recent date
-- select time, item_id, count from transaction_t
-- where 
-- company_id = 1 and     
--     time in ( 
--         select time from transaction_t
--         where company_id = 1
--         group by time
--         order by time desc
--         limit 2
--     )

select 
    t.time,
    t.item_id,
    t.count,
    t.rank
from (
    select 
        *,
        dense_rank() over(order by t.time desc) as rank
    from transaction_t t
    where company_id = 1
) as t
where rank <= 2;





-- select time from transaction_t
--         where company_id = 1
--         group by time
--         order by time desc
--         limit 2

-- select t.time from transaction_t t
-- where t.company_id = 1
-- group by t.time 
-- order by t.time desc
;

-- ;
;


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


