--
-- PostgreSQL database dump
--

\restrict td6QkhLGc5j4hbQYW7sPG6nw6nBHsPRJd2tiTnZHErUovdQ21Cr7qbtCThVUQe0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    active boolean NOT NULL,
    id integer NOT NULL,
    status boolean NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    account_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(800) NOT NULL,
    role character varying(255) NOT NULL,
    CONSTRAINT account_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'USER'::character varying])::text[])))
);


--
-- Name: cart_item_option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_item_option_values (
    cart_item_id integer NOT NULL,
    option_value_id integer NOT NULL
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    cart_id integer NOT NULL,
    id integer NOT NULL,
    price numeric(38,2) NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    selected boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255)
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    account_id integer NOT NULL,
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying(255)
);


--
-- Name: invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice (
    customer_id integer NOT NULL,
    discount_amount numeric(38,2) NOT NULL,
    id integer NOT NULL,
    order_id integer NOT NULL,
    payment_method_id integer NOT NULL,
    shipping_fee numeric(38,2) NOT NULL,
    staff_id integer,
    sub_total numeric(38,2) NOT NULL,
    total_amount numeric(38,2) NOT NULL,
    user_information_id integer NOT NULL,
    voucher_id integer,
    created_at timestamp(6) without time zone NOT NULL,
    invoice_date timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    invoice_number character varying(50) NOT NULL
);


--
-- Name: invoice_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_details (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    line_total numeric(38,2) NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: option_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.option_group (
    id integer NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying(255),
    selection_type character varying(255) NOT NULL,
    CONSTRAINT option_group_selection_type_check CHECK (((selection_type)::text = ANY ((ARRAY['SINGLE'::character varying, 'MULTIPLE'::character varying])::text[])))
);


--
-- Name: option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.option_values (
    additional_price numeric(38,2) NOT NULL,
    id integer NOT NULL,
    options_group_id integer NOT NULL,
    stock_quantity integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    CONSTRAINT option_values_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'HIDDEN'::character varying, 'OUT_OF_STOCK'::character varying, 'DISCONTINUED'::character varying])::text[])))
);


--
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    account_id integer NOT NULL,
    id integer NOT NULL,
    total_price numeric(38,2),
    user_infomation_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    order_time timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255),
    order_status character varying(255) NOT NULL,
    CONSTRAINT order_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['PLACED'::character varying, 'CONFIRMED'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: order_item_option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item_option_values (
    option_value_id integer NOT NULL,
    order_item_id integer NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255)
);


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    amount numeric(38,2) NOT NULL,
    id integer NOT NULL,
    order_id integer NOT NULL,
    payment_method_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    payment_time timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(255) NOT NULL,
    transaction_id character varying(255),
    CONSTRAINT payment_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_method (
    id integer NOT NULL,
    is_active boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    code character varying(255),
    description character varying(255),
    name character varying(255)
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    category_id integer NOT NULL,
    id integer NOT NULL,
    price_base numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    description character varying(255),
    img_main character varying(255),
    name character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    CONSTRAINT product_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'HIDDEN'::character varying, 'OUT_OF_STOCK'::character varying, 'DISCONTINUED'::character varying])::text[])))
);


--
-- Name: token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token (
    account_id integer NOT NULL,
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    expiration_time timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    token text NOT NULL,
    token_type character varying(255) NOT NULL,
    CONSTRAINT token_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['EMAIL_VERIFICATION'::character varying, 'REFRESH_TOKEN'::character varying])::text[])))
);


--
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_information; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_information (
    account_id integer NOT NULL,
    id integer NOT NULL,
    is_default boolean NOT NULL,
    gender character varying(6),
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    phone_number character varying(20),
    address character varying(255),
    fullname character varying(255),
    CONSTRAINT user_information_gender_check CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying])::text[])))
);


--
-- Name: voucher; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.voucher (
    active boolean NOT NULL,
    amount numeric(38,2),
    id integer NOT NULL,
    min_order_value numeric(38,2),
    percent double precision,
    created_at timestamp(6) without time zone NOT NULL,
    end_date timestamp(6) without time zone NOT NULL,
    start_date timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    code character varying(50) NOT NULL,
    type character varying(255) NOT NULL,
    CONSTRAINT voucher_type_check CHECK (((type)::text = ANY ((ARRAY['PERCENTAGE'::character varying, 'FIXED_AMOUNT'::character varying])::text[])))
);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (active, id, status, created_at, updated_at, account_name, email, password, role) FROM stdin;
t	1977765114	t	2025-10-16 14:30:54.526513	2025-10-16 14:31:08.727169	Nguyen Van A	kien06112004@gmail.com	$2a$10$S/wZ.zU0DMN41e5CuBzrgOEdmcNU.XRxnXNM1OXZIjfeL2N0kZBEW	USER
\.


--
-- Data for Name: cart_item_option_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_item_option_values (cart_item_id, option_value_id) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (cart_id, id, price, product_id, quantity, selected, created_at, updated_at, note) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (account_id, id, created_at, updated_at) FROM stdin;
1977765114	1029391977	2025-10-16 14:33:13.627142	2025-10-16 14:33:13.627142
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category (id, created_at, updated_at, name) FROM stdin;
1	2025-10-16 07:30:29.283495	2025-10-16 07:30:29.283495	Burger
2	2025-10-16 07:30:29.283495	2025-10-16 07:30:29.283495	Pizza
3	2025-10-16 07:30:29.283495	2025-10-16 07:30:29.283495	Gà Rán
4	2025-10-16 07:30:29.283495	2025-10-16 07:30:29.283495	Đồ Uống
5	2025-10-16 07:30:29.283495	2025-10-16 07:30:29.283495	Món Ăn Phụ
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invoice (customer_id, discount_amount, id, order_id, payment_method_id, shipping_fee, staff_id, sub_total, total_amount, user_information_id, voucher_id, created_at, invoice_date, updated_at, invoice_number) FROM stdin;
\.


--
-- Data for Name: invoice_details; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invoice_details (id, invoice_id, line_total, product_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: option_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.option_group (id, product_id, created_at, updated_at, name, selection_type) FROM stdin;
1	1	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Kích cỡ	SINGLE
2	1	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Thêm phô mai	MULTIPLE
3	1	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Nước uống kèm	SINGLE
4	6	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Kích cỡ	SINGLE
5	6	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Vỏ bánh	SINGLE
6	6	2025-10-16 07:30:39.420661	2025-10-16 07:30:39.420661	Thêm topping	MULTIPLE
\.


--
-- Data for Name: option_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.option_values (additional_price, id, options_group_id, stock_quantity, created_at, updated_at, name, status) FROM stdin;
10000.00	2	1	100	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Vừa	ACTIVE
15000.00	3	1	100	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Lớn	ACTIVE
8000.00	5	2	60	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Phô mai tan chảy	ACTIVE
0.00	6	3	200	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Coca	ACTIVE
0.00	7	3	180	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Pepsi	ACTIVE
0.00	8	3	150	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	7 Up	ACTIVE
0.00	9	4	80	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Nhỏ 6 inch	ACTIVE
20000.00	10	4	70	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Vừa 9 inch	ACTIVE
40000.00	11	4	60	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Lớn 12 inch	ACTIVE
0.00	12	5	90	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Vỏ dày	ACTIVE
0.00	13	5	90	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Vỏ mỏng	ACTIVE
15000.00	14	6	100	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Thêm phô mai	ACTIVE
20000.00	15	6	100	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Thêm hải sản	ACTIVE
0.00	1	1	99	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Nhỏ	ACTIVE
5000.00	4	2	79	2025-10-16 07:30:43.055304	2025-10-16 07:30:43.055304	Phô mai lát	ACTIVE
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."order" (account_id, id, total_price, user_infomation_id, created_at, order_time, updated_at, note, order_status) FROM stdin;
1977765114	1611090155	70000.00	507098509	2025-10-16 15:26:56.025884	2025-10-16 15:26:56.018723	2025-10-16 16:26:29.555351	\N	CONFIRMED
\.


--
-- Data for Name: order_item_option_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_item_option_values (option_value_id, order_item_id) FROM stdin;
1	1575108902
4	1575108902
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, created_at, updated_at, note) FROM stdin;
1575108902	1611090155	1	1	70000.00	2025-10-16 15:26:56.042204	2025-10-16 15:26:56.044713	giao trước 13h
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (amount, id, order_id, payment_method_id, created_at, payment_time, updated_at, status, transaction_id) FROM stdin;
70000.00	874399905	1611090155	1	2025-10-16 15:56:05.745415	2025-10-16 15:56:05.714	2025-10-16 15:56:05.745415	PENDING	\N
70000.00	1162954075	1611090155	1	2025-10-16 16:12:52.293693	2025-10-16 16:12:52.291	2025-10-16 16:26:29.554351	COMPLETED	15206388
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_method (id, is_active, created_at, updated_at, code, description, name) FROM stdin;
1	t	2025-10-16 15:50:58	2025-10-16 15:51:00	VNPAY	Thanh toán bằng VNPAY	VNPAY
2	t	2025-10-16 15:51:25	2025-10-16 15:51:27	CASH	Thanh toán bằng tiền mặt	CASH
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product (category_id, id, price_base, quantity, created_at, updated_at, description, img_main, name, status) FROM stdin;
1	2	59000.00	60	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger gà chiên giòn rụm	burger_ga_gion.jpg	Burger Gà Giòn	ACTIVE
1	3	62000.00	45	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger tôm chiên kèm rau tươi	burger_tom.jpg	Burger Tôm	ACTIVE
1	4	61000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger cá chiên giòn	burger_ca.jpg	Burger Cá	ACTIVE
1	5	69000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger bò nướng sốt BBQ	burger_bbq.jpg	Burger Bò Nướng BBQ	ACTIVE
2	6	129000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza topping hải sản tươi ngon	pizza_hai_san.jpg	Pizza Hải Sản	ACTIVE
2	7	119000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza thịt xông khói đậm vị	pizza_thit_xong_khoi.jpg	Pizza Thịt Xông Khói	ACTIVE
2	8	125000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza bò phô mai tan chảy	pizza_bo_pho_mai.jpg	Pizza Bò Phô Mai	ACTIVE
2	9	99000.00	30	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza rau củ tươi mát	pizza_chay.jpg	Pizza Chay	ACTIVE
2	10	109000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza truyền thống Ý	pizza_truyen_thong.jpg	Pizza Truyền Thống	ACTIVE
3	11	45000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Miếng gà rán giòn tan	ga_ran_truyen_thong.jpg	Gà Rán Truyền Thống	ACTIVE
3	12	49000.00	90	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Gà rán kèm sốt cay đậm vị	ga_sot_cay.jpg	Gà Sốt Cay	ACTIVE
3	13	52000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Cánh gà nướng BBQ thơm ngon	canh_ga_bbq.jpg	Cánh Gà BBQ	ACTIVE
3	14	55000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Miếng gà không xương tiện lợi	ga_khong_xuong.jpg	Gà Không Xương	ACTIVE
3	15	40000.00	120	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Gà popcorn giòn nhỏ xinh	ga_popcorn.jpg	Gà Popcorn	ACTIVE
4	16	19000.00	200	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Nước giải khát Coca	coca.jpg	Coca-Cola	ACTIVE
4	17	19000.00	180	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Nước giải khát Pepsi	pepsi.jpg	Pepsi	ACTIVE
4	18	25000.00	150	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Trà đào thơm mát	tra_dao.jpg	Trà Đào	ACTIVE
4	19	35000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Trà sữa kèm trân châu dẻo	tra_sua.jpg	Trà Sữa Trân Châu	ACTIVE
4	20	10000.00	250	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Nước suối đóng chai	nuoc_suoi.jpg	Nước Suối	ACTIVE
5	21	25000.00	150	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Khoai chiên giòn rụm	khoai_tay_chien.jpg	Khoai Tây Chiên	ACTIVE
5	22	30000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Salad tươi mát	salad.jpg	Salad Rau Trộn	ACTIVE
5	23	28000.00	90	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Phô mai chiên giòn	pho_mai_que.jpg	Phô Mai Que	ACTIVE
5	24	20000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Bánh mì bơ tỏi thơm lừng	banh_mi_bo_toi.jpg	Bánh Mì Bơ Tỏi	ACTIVE
5	25	25000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Khoai lang chiên vàng	khoai_lang_ken.jpg	Khoai Lang Kén	ACTIVE
1	26	75000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger bò 2 tầng	burger_double.jpg	Burger Bò Double	ACTIVE
1	27	65000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger gà cay đặc biệt	burger_ga_cay.jpg	Burger Gà Cay	ACTIVE
2	28	135000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza hải sản sốt cay	pizza_hai_san_cay.jpg	Pizza Hải Sản Cay	ACTIVE
2	29	139000.00	35	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza 4 loại phô mai	pizza_4_pho_mai.jpg	Pizza Phô Mai 4 Tầng	ACTIVE
3	30	53000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Cánh gà chiên mật ong	canh_ga_mat_ong.jpg	Cánh Gà Mật Ong	ACTIVE
3	31	49000.00	90	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Gà viên nhân phô mai tan chảy	ga_vien_pho_mai.jpg	Gà Viên Phô Mai	ACTIVE
4	32	19000.00	200	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Nước giải khát 7 Up	7up.jpg	7 Up	ACTIVE
4	33	23000.00	150	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Trà chanh tươi mát	tra_chanh.jpg	Trà Chanh	ACTIVE
5	34	27000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Bánh ngô chiên giòn	banh_ngo.jpg	Bánh Ngô	ACTIVE
5	35	32000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Xúc xích Đức nướng	xuc_xich_duc.jpg	Xúc Xích Đức	ACTIVE
1	36	69000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger bò phô mai và thịt xông khói	burger_bacon.jpg	Burger Phô Mai Bacon	ACTIVE
1	37	64000.00	55	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger gà với sốt mật ong	burger_ga_mat_ong.jpg	Burger Gà Sốt Mật Ong	ACTIVE
2	38	95000.00	45	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza rau củ tươi mát	pizza_rau_cu.jpg	Pizza Rau Củ	ACTIVE
2	39	115000.00	50	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza gà BBQ	pizza_ga_bbq.jpg	Pizza Gà BBQ	ACTIVE
3	40	54000.00	70	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Cánh gà sốt tỏi cay nồng	canh_ga_toi.jpg	Cánh Gà Sốt Tỏi	ACTIVE
3	41	42000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Gà viên chiên giòn	ga_vien_gion.jpg	Gà Viên Giòn	ACTIVE
4	42	36000.00	120	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Trà sữa vị matcha	tra_sua_matcha.jpg	Trà Sữa Matcha	ACTIVE
4	43	30000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Cà phê sữa đá Việt Nam	ca_phe_sua.jpg	Cà Phê Sữa	ACTIVE
5	44	27000.00	90	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Khoai tây chiên phủ phô mai bột	khoai_lac_pho_mai.jpg	Khoai Tây Lắc Phô Mai	ACTIVE
5	45	29000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Bánh vòng hành tây chiên	hanh_tay.jpg	Bánh Hành Tây	ACTIVE
1	46	63000.00	45	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger cá chiên sốt cay	burger_ca_cay.jpg	Burger Cá Cay	ACTIVE
2	47	128000.00	40	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Pizza bò nướng BBQ	pizza_bo_bbq.jpg	Pizza Bò BBQ	ACTIVE
3	48	52000.00	80	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Gà rán kèm sốt phô mai	ga_sot_pho_mai.jpg	Gà Sốt Phô Mai	ACTIVE
4	49	24000.00	130	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Trà tắc pha mật ong	tra_tac_mat_ong.jpg	Trà Tắc Mật Ong	ACTIVE
5	50	25000.00	100	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Bánh chuối chiên giòn vàng	banh_chuoi_chien.jpg	Bánh Chuối Chiên	ACTIVE
1	1	65000.00	49	2025-10-16 07:30:34.022037	2025-10-16 07:30:34.022037	Burger bò kèm phô mai thơm béo	burger_bo_pho_mai.jpg	Burger Bò Phô Mai	ACTIVE
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token (account_id, id, created_at, expiration_time, updated_at, token, token_type) FROM stdin;
1977765114	2	2025-10-16 14:32:50.151368	2025-10-23 14:32:50.151368	2025-10-16 14:32:50.151368	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImtpZW4wNjExMjAwNEBnbWFpbC5jb20iLCJpYXQiOjE3NjA1OTk5NzAsImV4cCI6MTc2MTIwNDc3MH0.GyVJnoYh8w8JahXvYYd9SLFs41J0zLI1OffaQE-RVM4	REFRESH_TOKEN
\.


--
-- Data for Name: user_information; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_information (account_id, id, is_default, gender, created_at, updated_at, phone_number, address, fullname) FROM stdin;
1977765114	507098509	t	MALE	2025-10-16 15:12:16.96905	2025-10-16 15:12:16.96905	0123456789	123456	kk
\.


--
-- Data for Name: voucher; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.voucher (active, amount, id, min_order_value, percent, created_at, end_date, start_date, updated_at, code, type) FROM stdin;
\.


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_id_seq', 2, true);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: invoice_details invoice_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_pkey PRIMARY KEY (id);


--
-- Name: invoice invoice_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoice invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (id);


--
-- Name: option_group option_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_group
    ADD CONSTRAINT option_group_pkey PRIMARY KEY (id);


--
-- Name: option_values option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_values
    ADD CONSTRAINT option_values_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token token_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key UNIQUE (token);


--
-- Name: user_information user_information_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT user_information_phone_number_key UNIQUE (phone_number);


--
-- Name: user_information user_information_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT user_information_pkey PRIMARY KEY (id);


--
-- Name: voucher voucher_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_code_key UNIQUE (code);


--
-- Name: voucher voucher_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (id);


--
-- Name: product fk1mtsbur82frn64de7balymq9s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT fk1mtsbur82frn64de7balymq9s FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- Name: payment fk33pd2iqamm9gp5c14r1catra2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fk33pd2iqamm9gp5c14r1catra2 FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- Name: option_values fk3rdlje92wfw5tbf58ctjpv17g; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_values
    ADD CONSTRAINT fk3rdlje92wfw5tbf58ctjpv17g FOREIGN KEY (options_group_id) REFERENCES public.option_group(id);


--
-- Name: order fk4c9jpp9nlheu0m0jkioa594en; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fk4c9jpp9nlheu0m0jkioa594en FOREIGN KEY (user_infomation_id) REFERENCES public.user_information(id);


--
-- Name: order_item_option_values fk8emyb6j513cos1saw1glkw3qa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_option_values
    ADD CONSTRAINT fk8emyb6j513cos1saw1glkw3qa FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: order_item_option_values fk8sd76lvmuud1a4pmmfu7bp4n3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_option_values
    ADD CONSTRAINT fk8sd76lvmuud1a4pmmfu7bp4n3 FOREIGN KEY (option_value_id) REFERENCES public.option_values(id);


--
-- Name: cart_item_option_values fk9rvppkh29f79m7pokt2jh7rt0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_option_values
    ADD CONSTRAINT fk9rvppkh29f79m7pokt2jh7rt0 FOREIGN KEY (option_value_id) REFERENCES public.option_values(id);


--
-- Name: cart_item_option_values fkec49opwhs569oulfijbqq83ra; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_option_values
    ADD CONSTRAINT fkec49opwhs569oulfijbqq83ra FOREIGN KEY (cart_item_id) REFERENCES public.cart_items(id);


--
-- Name: invoice fken0whtvw1hfy49i3b9h95rosq; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fken0whtvw1hfy49i3b9h95rosq FOREIGN KEY (staff_id) REFERENCES public.account(id);


--
-- Name: option_group fkes46mj8bnkxchoknstk4poadg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_group
    ADD CONSTRAINT fkes46mj8bnkxchoknstk4poadg FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: order fkfir2cy59xrrxiv1w7bok6pv7e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fkfir2cy59xrrxiv1w7bok6pv7e FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- Name: token fkftkstvcfb74ogw02bo5261kno; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT fkftkstvcfb74ogw02bo5261kno FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- Name: invoice fkgt3r691aydad7tw2qkijym5ga; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fkgt3r691aydad7tw2qkijym5ga FOREIGN KEY (user_information_id) REFERENCES public.user_information(id);


--
-- Name: invoice fkh8mc37lrohbk7stgatwwn5doq; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fkh8mc37lrohbk7stgatwwn5doq FOREIGN KEY (voucher_id) REFERENCES public.voucher(id);


--
-- Name: user_information fkhn9fqhsqg9l1h8uem9qx3n5p1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT fkhn9fqhsqg9l1h8uem9qx3n5p1 FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- Name: order_items fkjg8ob3r0ws22krbj2xu30nhi1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkjg8ob3r0ws22krbj2xu30nhi1 FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- Name: invoice fkjhismy9m4qxx6tbjn75w1qakb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fkjhismy9m4qxx6tbjn75w1qakb FOREIGN KEY (customer_id) REFERENCES public.account(id);


--
-- Name: payment fkjii2n6db6cje3km5ybsbgo8cl; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fkjii2n6db6cje3km5ybsbgo8cl FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id);


--
-- Name: cart_items fkl7je3auqyq1raj52qmwrgih8x; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkl7je3auqyq1raj52qmwrgih8x FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: order_items fklf6f9q956mt144wiv6p1yko16; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fklf6f9q956mt144wiv6p1yko16 FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: invoice_details fkpc7xa72mljy7weoct7uubgjy7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT fkpc7xa72mljy7weoct7uubgjy7 FOREIGN KEY (invoice_id) REFERENCES public.invoice(id);


--
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: invoice fkr27vrfyll0shs80upv1rmctie; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fkr27vrfyll0shs80upv1rmctie FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- Name: invoice fkrgxmd0sscce0tgfckpcoydrwl; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT fkrgxmd0sscce0tgfckpcoydrwl FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id);


--
-- Name: invoice_details fkswgjrgy5eebhfkmm7bliiyw71; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT fkswgjrgy5eebhfkmm7bliiyw71 FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: carts fktbh18csnlmy9mre0klfe4m941; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fktbh18csnlmy9mre0klfe4m941 FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- PostgreSQL database dump complete
--

\unrestrict td6QkhLGc5j4hbQYW7sPG6nw6nBHsPRJd2tiTnZHErUovdQ21Cr7qbtCThVUQe0

