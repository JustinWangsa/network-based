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



-- I.id, I.name, I.image, I.currentStock, S.price

-- with recent
-- select *, max(time) over(partition by s.item_id) as recent 
-- from stock_t s
-- ;

-- only most recent
-- select * 
-- from(
--     select *, max(time) over(partition by s.item_id) as recent 
--     from stock_t s
-- ) as s
-- where s.time = s.recent
-- ;

select 
    i.id,
    i.name,
    -- i.image,
    i.currentStock,
    s.price
from (
    select * from item_t
    where company_id = 2 
) as i
join (
    select *, max(s.time) over(partition by s.item_id) as recent
    from stock_t s
) as s
on i.id = s.item_id and i.company_id = s.company_id
where s.time = s.recent
;

-- select 
--     i.name
--     ,i.currentStock
--     ,s.company_id
--     ,s.time
--     ,s.item_id
--     ,s.price
--     ,s.recent
-- from item_t i join (
--     select 
--         *,
--         max(s.time) over(partition by s.item_id) as recent
--     from stock_t s
-- ) s on i.id = s.item_id
-- where 
--     s.time = s.recent and 
    
-- ;


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


