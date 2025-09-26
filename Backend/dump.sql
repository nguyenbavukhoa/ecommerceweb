--
-- PostgreSQL database dump
--

\restrict WpqpD0eUK5CC4PiFwXmNWANZruxoeShgtOiHjFNOgLOAf00ArDVfMvwXID6ixTc

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
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    account_name character varying(100) NOT NULL,
    active boolean NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(800) NOT NULL,
    role character varying(255) NOT NULL,
    status boolean NOT NULL,
    CONSTRAINT account_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'USER'::character varying])::text[])))
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255),
    quantity integer DEFAULT 1 NOT NULL,
    selected boolean DEFAULT true NOT NULL,
    cart_id integer NOT NULL,
    product_variants_id integer NOT NULL,
    variant_values_id integer
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    account_id integer NOT NULL
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
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255),
    order_status character varying(255) NOT NULL,
    order_time timestamp(6) without time zone NOT NULL,
    total_price numeric(38,2),
    account_id integer NOT NULL,
    user_infomation_id integer NOT NULL,
    CONSTRAINT order_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['PLACED'::character varying, 'CONFIRMED'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    note character varying(255),
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    order_id integer NOT NULL,
    product_variants_id integer NOT NULL,
    variant_values_id integer
);


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    amount numeric(38,2) NOT NULL,
    payment_time timestamp(6) without time zone NOT NULL,
    status character varying(255) NOT NULL,
    transaction_id character varying(255),
    order_id integer NOT NULL,
    payment_method_id integer NOT NULL,
    CONSTRAINT payment_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_method (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    code character varying(255),
    description character varying(255),
    is_active boolean,
    name character varying(255)
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    description character varying(255),
    img_main character varying(255),
    is_active boolean NOT NULL,
    name character varying(255) NOT NULL,
    price_base numeric(38,2) NOT NULL,
    product_categories_id integer NOT NULL
);


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying(255),
    category_id integer NOT NULL
);


--
-- Name: product_variant_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant_values (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    quantity integer NOT NULL,
    variant_id integer NOT NULL,
    value_id integer
);


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    img_url character varying(255),
    price numeric(38,2) NOT NULL,
    status character varying(255) NOT NULL,
    sku character varying(255) NOT NULL,
    stock_quantity integer NOT NULL,
    product_id integer NOT NULL,
    variant_option_id integer,
    CONSTRAINT product_variants_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'HIDDEN'::character varying, 'DISCONTINUED'::character varying, 'UNAVAILABLE'::character varying])::text[])))
);


--
-- Name: token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    expiration_time timestamp(6) without time zone NOT NULL,
    token text NOT NULL,
    token_type character varying(255) NOT NULL,
    account_id integer NOT NULL,
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
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    address character varying(255),
    fullname character varying(255),
    gender character varying(6),
    is_default boolean NOT NULL,
    phone_number character varying(20),
    account_id integer NOT NULL,
    CONSTRAINT user_information_gender_check CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying])::text[])))
);


--
-- Name: variant_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_options (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying(255),
    product_categories_id integer NOT NULL
);


--
-- Name: variant_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_values (
    id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    price numeric(38,2) NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    value character varying(255),
    variant_options_id integer NOT NULL
);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (id, created_at, updated_at, account_name, active, email, password, role, status) FROM stdin;
334709391	2025-09-22 21:25:29.678605	2025-09-22 21:51:38.977976	Nguyen Van A	t	kien06112004@gmail.com	$2a$10$VHCwo.0hapz1kgjawfz5MOUW27OI6LEpJmRkiuAYQ3MEb7YSn9/oy	USER	t
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, created_at, updated_at, note, quantity, selected, cart_id, product_variants_id, variant_values_id) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, created_at, updated_at, account_id) FROM stdin;
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category (id, created_at, updated_at, name) FROM stdin;
1	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Món Việt
2	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Đồ nướng & BBQ
3	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Lẩu & Nướng
4	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Món Hàn
5	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Món Nhật
6	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Món Thái
7	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Pizza & Burger
8	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Trà sữa & Café
9	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Tráng miệng
10	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Đồ chay
11	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Ăn vặt
12	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Hoa quả & Sinh tố
13	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Cơm văn phòng
14	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Bữa sáng
15	2025-09-23 21:50:06.451686	2025-09-23 21:50:06.451686	Thức ăn nhanh
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."order" (id, created_at, updated_at, note, order_status, order_time, total_price, account_id, user_infomation_id) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, created_at, updated_at, note, quantity, unit_price, order_id, product_variants_id, variant_values_id) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (id, created_at, updated_at, amount, payment_time, status, transaction_id, order_id, payment_method_id) FROM stdin;
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_method (id, created_at, updated_at, code, description, is_active, name) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product (id, created_at, updated_at, description, img_main, is_active, name, price_base, product_categories_id) FROM stdin;
1	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Phở bò truyền thống với nước dùng được ninh từ xương bò suốt 12 tiếng, thịt bò tươi ngon và bánh phở dai mềm	/images/pho-bo-hanoi.jpg	t	Phở Bò Hà Nội	45000.00	1
2	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Phở gà với nước dùng trong vắt, thịt gà thả vườn tươi ngon, rau thơm đầy đủ	/images/pho-ga.jpg	t	Phở Gà Thơm Ngon	40000.00	1
3	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Phở đặc biệt với đầy đủ loại thịt bò: tái, chín, gầu, gân, sách. Phù hợp cho những ai muốn thưởng thức trọn vẹn hương vị phở	/images/pho-dac-biet.jpg	t	Phở Đặc Biệt Sài Gòn	55000.00	1
4	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bún bò Huế với nước dùng cay nồng, chả cua, giò heo, bún tươi và rau sống đặc trưng xứ Huế	/images/bun-bo-hue.jpg	t	Bún Bò Huế Chính Gốc	48000.00	2
5	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Phiên bản chay của bún bò Huế với nước dùng từ nấm và rau củ, đậu hũ chiên và rau sống	/images/bun-bo-hue-chay.jpg	t	Bún Bò Huế Chay	42000.00	2
6	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bánh mì giòn rụm với thịt nướng thơm lừng, pate, rau sống và gia vị đặc biệt	/images/banh-mi-thit-nuong.jpg	t	Bánh Mì Thịt Nướng	25000.00	3
7	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bánh mì truyền thống với pate gan heo, chả lụa, dưa leo và rau thơm	/images/banh-mi-pate.jpg	t	Bánh Mì Pate	20000.00	3
8	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bánh mì với đầy đủ loại nhân: thịt nướng, pate, chả cua, trứng và rau sống	/images/banh-mi-dac-biet.jpg	t	Bánh Mì Đặc Biệt	35000.00	3
9	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cơm tấm với sườn nướng thơm phức, chả trứng, bì và nước mắm pha chua ngọt	/images/com-tam-suon-nuong.jpg	t	Cơm Tấm Sườn Nướng	35000.00	4
10	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cơm tấm đầy đủ với sườn nướng, bì, chả, trứng và tôm khô rang	/images/com-tam-dac-biet.jpg	t	Cơm Tấm Đặc Biệt	45000.00	4
11	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Pizza truyền thống Italy với sốt cà chua tươi, phô mai Mozzarella và lá húng quế tươi	/images/pizza-margherita.jpg	t	Pizza Margherita Classic	150000.00	36
12	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Pizza 4 mùa với nấm, ham, artichoke và olives trên nền sốt cà chua thơm ngon	/images/pizza-quattro-stagioni.jpg	t	Pizza Quattro Stagioni	180000.00	36
13	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Pizza cay với pepperoni cay, phô mai Mozzarella và ớt đỏ tươi	/images/pizza-diavola.jpg	t	Pizza Diavola	170000.00	36
14	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Pizza kiểu Mỹ với pepperoni, xúc xích, ớt chuông, nấm và hành tây	/images/pizza-supreme.jpg	t	Pizza Supreme	200000.00	37
15	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Pizza dành cho người yêu thịt với pepperoni, xúc xích, thịt xông khói và ham	/images/pizza-meat-lovers.jpg	t	Pizza Meat Lovers	220000.00	37
16	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Burger bò classic với thịt bò Angus 100%, rau xanh, cà chua và sốt đặc biệt	/images/classic-beef-burger.jpg	t	Classic Beef Burger	65000.00	38
17	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Burger bò với thịt xông khói giòn, sốt BBQ và hành tây chiên	/images/bbq-bacon-burger.jpg	t	BBQ Bacon Burger	75000.00	38
18	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Burger 2 lớp thịt bò với phô mai cheddar tan chảy	/images/double-cheeseburger.jpg	t	Double Cheeseburger	95000.00	38
19	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Burger gà giòn rụm với sốt mayonnaise và rau xanh tươi	/images/crispy-chicken-burger.jpg	t	Crispy Chicken Burger	58000.00	39
20	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Burger gà cay với sốt buffalo và dưa chuột muối	/images/spicy-chicken-burger.jpg	t	Spicy Chicken Burger	62000.00	39
21	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Trà sữa đậm đà với trân châu đường đen dai mềm và cream cheese béo ngậy	/images/tra-sua-tran-chau-duong-den.jpg	t	Trà Sữa Trân Châu Đường Đen	35000.00	41
22	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Trà sữa pha từ trà oolong cao cấp với trân châu trắng và đường phên	/images/tra-sua-oolong.jpg	t	Trà Sữa Oolong Truyền Thống	32000.00	41
23	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Trà sữa vị matcha Nhật Bản thơm ngon với topping trân châu và thạch dừa	/images/tra-sua-matcha.jpg	t	Trà Sữa Matcha	38000.00	41
24	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Trà sữa đường nâu với lớp kem cheese mặn ngọt hài hòa	/images/brown-sugar-milk-tea.jpg	t	Brown Sugar Milk Tea	42000.00	42
25	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Trà sữa khoai môn với kem cheese thơm béo	/images/taro-cheese-milk-tea.jpg	t	Taro Milk Tea Cheese	40000.00	42
26	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cà phê đen truyền thống pha phin với hạt cà phê Robusta đậm đà	/images/ca-phe-den-da.jpg	t	Cà Phê Đen Đá	18000.00	43
27	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cà phê đen nóng thơm lừng, phù hợp cho buổi sáng	/images/ca-phe-den-nong.jpg	t	Cà Phê Đen Nóng	15000.00	43
28	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cà phê sữa đá truyền thống Việt Nam với sữa đặc ngọt ngào	/images/ca-phe-sua-da.jpg	t	Cà Phê Sữa Đá	22000.00	44
29	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bạc xỉu với tỷ lệ sữa nhiều hơn, vị ngọt nhẹ nhàng	/images/bac-xiu-da.jpg	t	Bạc Xỉu Đá	25000.00	44
30	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Gà rán với lớp vỏ giòn rụm, thịt gà mềm ngọt bên trong, tẩm ướp gia vị đặc biệt	/images/ga-ran-gion-truyen-thong.jpg	t	Gà Rán Giòn Truyền Thống	45000.00	75
31	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Gà rán kiểu Hàn Quốc với sốt gochujang cay nồng và mè rang	/images/ga-ran-cay-han-quoc.jpg	t	Gà Rán Cay Hàn Quốc	50000.00	75
32	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Gà rán tẩm sốt mật ong ngọt ngào, thơm phức	/images/ga-ran-mat-ong.jpg	t	Gà Rán Mật Ong	53000.00	75
33	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Lẩu Tom Yum chua cay với tôm, mực, cua và nấm các loại	/images/lau-tom-yum-hai-san.jpg	t	Lẩu Tom Yum Hải Sản	180000.00	15
34	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Lẩu Thái chay với nước dùng từ rau củ và nấm, đậu phụ và rau xanh	/images/lau-thai-chay.jpg	t	Lẩu Thái Chay	150000.00	15
35	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Set sashimi gồm cá hồi, cá ngừ và cá trắng tươi ngon	/images/sashimi-mix-set.jpg	t	Sashimi Mix Set	120000.00	25
36	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Sushi cuộn California với cua, bơ và dưa chuột	/images/california-roll.jpg	t	California Roll	85000.00	25
37	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Sushi cuốn cá hồi nướng teriyaki với rong biển và cơm	/images/salmon-teriyaki-roll.jpg	t	Salmon Teriyaki Roll	95000.00	25
38	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Ramen nước dùng shoyu (nước tương) với thịt xá xíu, trứng lòng đào và rau xanh	/images/shoyu-ramen.jpg	t	Shoyu Ramen	55000.00	27
39	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Ramen nước dùng xương heo đậm đà với thịt xá xíu và trứng lòng đào	/images/tonkotsu-ramen.jpg	t	Tonkotsu Ramen	65000.00	27
40	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Ramen nước dùng miso với rau củ và thịt heo	/images/miso-ramen.jpg	t	Miso Ramen	60000.00	27
41	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Xôi nếp thơm với thịt gà luộc, hành phi và nước mắm	/images/xoi-ga.jpg	t	Xôi Gà	25000.00	70
42	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Xôi nếp với xíu mại hấp và tương ớt	/images/xoi-xiu-mai.jpg	t	Xôi Xíu Mại	22000.00	70
43	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cháo gà ninh nhừ với thịt gà băm và rau thơm	/images/chao-ga-tan.jpg	t	Cháo Gà Tần	28000.00	72
44	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Cháo hến đặc sản với hến xào và rau thơm	/images/chao-hen.jpg	t	Cháo Hến	30000.00	72
45	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Sinh tố bơ béo ngậy với sữa tươi và đá bào	/images/sinh-to-bo.jpg	t	Sinh Tố Bơ	28000.00	63
46	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Sinh tố dâu tây tươi mát với sữa chua	/images/sinh-to-dau.jpg	t	Sinh Tố Dâu	32000.00	63
47	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bánh Tiramisu Italy với lớp kem mascarpone và cà phê đắng	/images/tiramisu.jpg	t	Tiramisu	45000.00	47
48	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Bánh phô mai với topping blueberry tươi	/images/cheesecake-blueberry.jpg	t	Cheesecake Blueberry	50000.00	47
49	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Salad Caesar với rau xà lách, phô mai parmesan và sốt Caesar	/images/salad-caesar.jpg	t	Salad Caesar	65000.00	56
50	2025-09-23 21:50:43.788863	2025-09-23 21:50:43.788863	Salad Cobb với gà nướng, thịt xông khói, trứng và bơ	/images/salad-cobb.jpg	t	Salad Cobb	75000.00	56
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_categories (id, created_at, updated_at, name, category_id) FROM stdin;
1	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Phở	1
2	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bún bò Huế	1
3	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh mì	1
4	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cơm tấm	1
5	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bún chả	1
6	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh cuốn	1
7	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Chè	1
8	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Nem rán	1
9	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Gỏi cuốn	1
10	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Thịt nướng	2
11	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Hải sản nướng	2
12	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Chả cá	2
13	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Nem nướng	2
14	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh tráng nướng	2
15	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Lẩu Thái	3
16	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Lẩu chua cay	3
17	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Lẩu nướng	3
18	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Buffet lẩu nướng	3
19	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Kimchi	4
20	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bulgogi	4
21	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bibimbap	4
22	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Tteokbokki	4
23	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Korean Fried Chicken	4
24	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Ramen Hàn Quốc	4
25	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Sushi	5
26	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Sashimi	5
27	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Ramen	5
28	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Tempura	5
29	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Donburi	5
30	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Yakitori	5
31	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Pad Thai	6
32	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Tom Yum	6
33	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Green Curry	6
34	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Som Tam	6
35	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Mango Sticky Rice	6
36	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Pizza Italy	7
37	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Pizza Mỹ	7
38	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Burger bò	7
39	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Burger gà	7
40	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Sandwich	7
41	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Trà sữa trân châu	8
42	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Trà sữa kem cheese	8
43	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cà phê đen	8
44	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cà phê sữa	8
45	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Smoothie	8
46	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Đá xay	8
47	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh ngọt	9
48	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Kem	9
49	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Pudding	9
50	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh flan	9
51	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Tiramisu	9
52	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cơm chay	10
53	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Phở chay	10
54	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bún chay	10
55	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh mì chay	10
56	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Salad	10
57	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh tráng	11
58	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Chả cá viên	11
59	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh căn	11
60	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh khọt	11
61	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Che cung	11
62	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Hoa quả tươi	12
63	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Sinh tố	12
64	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Nước ép	12
65	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Salad trái cây	12
66	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cơm hộp	13
67	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cơm trưa	13
68	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Set ăn văn phòng	13
69	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cơm dinh dưỡng	13
70	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Xôi	14
71	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh mì	14
72	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cháo	14
73	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Bánh cuốn	14
74	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Cà phê sáng	14
75	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Gà rán	15
76	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Khoai tây chiên	15
77	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Hot dog	15
78	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Combo fast food	15
79	2025-09-23 21:50:16.475093	2025-09-23 21:50:16.475093	Mì tôm	15
\.


--
-- Data for Name: product_variant_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant_values (id, created_at, updated_at, quantity, variant_id, value_id) FROM stdin;
1	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	1	1
2	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	2	2
3	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	3	4
4	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	4	5
5	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	5	6
6	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	6	7
7	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	7	8
8	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	8	9
9	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	9	3
10	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	10	5
11	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	11	7
12	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	12	11
13	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	13	16
14	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	14	17
15	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	15	12
16	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	16	16
17	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	17	18
18	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	18	36
19	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	19	21
20	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	20	22
21	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	21	23
22	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	22	27
23	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	23	28
24	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	24	29
25	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	25	24
26	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	26	25
27	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	27	26
28	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	28	32
29	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	29	36
30	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	30	37
31	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	31	33
32	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	32	36
33	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	33	32
34	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	34	38
35	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	35	39
36	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	36	40
37	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	37	41
38	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	38	44
39	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	39	45
40	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	40	46
41	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	41	50
42	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	42	51
43	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	43	52
44	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	44	39
45	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	45	40
46	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	46	42
47	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	47	43
48	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	48	47
49	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	49	48
50	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	50	54
51	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	51	55
52	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	52	56
53	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	53	57
54	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	54	58
55	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	55	59
56	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	56	60
57	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	57	61
58	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	58	62
59	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	59	63
60	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	60	64
61	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	61	58
62	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	62	59
63	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	63	65
64	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	64	66
65	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	65	67
66	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	66	68
67	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	67	69
68	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	68	70
69	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	69	71
70	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	70	74
71	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	71	75
72	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	72	76
73	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	73	73
74	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	1	74	74
75	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	75	\N
76	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	76	\N
77	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	77	\N
78	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	78	\N
79	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	79	\N
80	2025-09-23 21:57:28.563856	2025-09-23 21:57:28.563856	0	80	\N
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, created_at, updated_at, img_url, price, status, sku, stock_quantity, product_id, variant_option_id) FROM stdin;
1	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-bo-tai.jpg	45000.00	ACTIVE	PHO-BO-TAI-001	50	1	1
2	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-bo-chin.jpg	45000.00	ACTIVE	PHO-BO-CHIN-001	50	1	1
3	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-dac-biet-hanoi.jpg	55000.00	ACTIVE	PHO-DAC-BIET-001	25	1	1
4	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-size-nho.jpg	0.00	ACTIVE	PHO-SIZE-S-001	100	1	2
5	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-size-vua.jpg	5000.00	ACTIVE	PHO-SIZE-M-001	100	1	2
6	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-size-lon.jpg	10000.00	ACTIVE	PHO-SIZE-L-001	100	1	2
7	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-them-thit.jpg	15000.00	ACTIVE	PHO-THEM-THIT-001	50	1	3
8	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-them-trung.jpg	8000.00	ACTIVE	PHO-THEM-TRUNG-001	50	1	3
9	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-ga-standard.jpg	40000.00	ACTIVE	PHO-GA-STD-002	30	2	1
10	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-ga-size-s.jpg	0.00	ACTIVE	PHO-GA-SIZE-S-002	100	2	2
11	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pho-ga-size-l.jpg	10000.00	ACTIVE	PHO-GA-SIZE-L-002	100	2	2
12	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/banh-mi-thit-nuong-std.jpg	25000.00	ACTIVE	BANH-MI-TN-006	40	6	4
13	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/banh-mi-combo-nuoc-ngot.jpg	10000.00	ACTIVE	BANH-MI-COMBO-NS-006	50	6	5
14	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/banh-mi-combo-ca-phe.jpg	15000.00	ACTIVE	BANH-MI-COMBO-CF-006	30	6	5
15	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/banh-mi-pate-std.jpg	20000.00	ACTIVE	BANH-MI-PATE-007	40	7	4
16	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/banh-mi-pate-combo.jpg	10000.00	ACTIVE	BANH-MI-PATE-COMBO-007	50	7	5
17	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/com-tam-suon-std.jpg	35000.00	ACTIVE	COM-TAM-SUON-009	30	9	6
18	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/com-tam-combo-nuoc.jpg	15000.00	ACTIVE	COM-TAM-COMBO-009	25	9	7
19	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-margherita-s.jpg	150000.00	ACTIVE	PIZZA-MAR-S-011	20	11	8
20	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-margherita-m.jpg	220000.00	ACTIVE	PIZZA-MAR-M-011	15	11	8
21	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-margherita-l.jpg	320000.00	ACTIVE	PIZZA-MAR-L-011	10	11	8
22	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-de-mong.jpg	0.00	ACTIVE	PIZZA-DE-MONG-011	50	11	9
23	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-de-day.jpg	15000.00	ACTIVE	PIZZA-DE-DAY-011	50	11	9
24	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-de-pho-mai.jpg	25000.00	ACTIVE	PIZZA-DE-CHEESE-011	30	11	9
25	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-supreme-s.jpg	180000.00	ACTIVE	PIZZA-SUP-S-014	20	14	11
26	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-supreme-m.jpg	250000.00	ACTIVE	PIZZA-SUP-M-014	15	14	11
27	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/pizza-supreme-l.jpg	350000.00	ACTIVE	PIZZA-SUP-L-014	10	14	11
28	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-bo-classic.jpg	65000.00	ACTIVE	BURGER-BO-CLA-016	25	16	13
29	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-combo-khoai.jpg	25000.00	ACTIVE	BURGER-COMBO-K-016	50	16	14
30	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-combo-full.jpg	35000.00	ACTIVE	BURGER-COMBO-F-016	30	16	14
31	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-bbq-bacon.jpg	75000.00	ACTIVE	BURGER-BBQ-017	20	17	13
32	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-bbq-combo.jpg	25000.00	ACTIVE	BURGER-BBQ-COMBO-017	50	17	14
33	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-ga-gion.jpg	58000.00	ACTIVE	BURGER-GA-GION-019	25	19	15
34	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/burger-ga-combo.jpg	25000.00	ACTIVE	BURGER-GA-COMBO-019	50	19	16
35	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-tc-dd-m.jpg	35000.00	ACTIVE	TS-TC-DD-M-021	100	21	17
36	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-tc-dd-l.jpg	43000.00	ACTIVE	TS-TC-DD-L-021	100	21	17
37	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-tc-dd-xl.jpg	50000.00	ACTIVE	TS-TC-DD-XL-021	50	21	17
38	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-0-duong.jpg	0.00	ACTIVE	TS-0DUONG-021	100	21	18
39	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-50-duong.jpg	0.00	ACTIVE	TS-50DUONG-021	100	21	18
40	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-100-duong.jpg	0.00	ACTIVE	TS-100DUONG-021	100	21	18
41	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-tran-chau-den.jpg	5000.00	ACTIVE	TS-TRAN-CHAU-DEN-021	100	21	19
42	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-tran-chau-trang.jpg	5000.00	ACTIVE	TS-TRAN-CHAU-TRANG-021	100	21	19
43	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-thach-dua.jpg	8000.00	ACTIVE	TS-THACH-DUA-021	50	21	19
44	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-oolong-m.jpg	32000.00	ACTIVE	TS-OOLONG-M-022	100	22	17
45	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tra-sua-oolong-l.jpg	40000.00	ACTIVE	TS-OOLONG-L-022	100	22	17
46	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/brown-sugar-m.jpg	42000.00	ACTIVE	BROWN-SUGAR-M-024	100	24	20
47	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/brown-sugar-l.jpg	52000.00	ACTIVE	BROWN-SUGAR-L-024	100	24	20
48	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/brown-sugar-0.jpg	0.00	ACTIVE	BROWN-SUGAR-0-024	100	24	21
49	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/brown-sugar-70.jpg	0.00	ACTIVE	BROWN-SUGAR-70-024	100	24	21
50	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ca-phe-den-nho.jpg	18000.00	ACTIVE	CF-DEN-S-026	100	26	22
51	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ca-phe-den-lon.jpg	26000.00	ACTIVE	CF-DEN-L-026	100	26	22
52	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ca-phe-sua-nho.jpg	22000.00	ACTIVE	CF-SUA-S-028	100	28	24
53	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ca-phe-sua-lon.jpg	32000.00	ACTIVE	CF-SUA-L-028	100	28	24
54	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-2-mieng.jpg	45000.00	ACTIVE	GA-RAN-2M-030	30	30	26
55	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-4-mieng.jpg	85000.00	ACTIVE	GA-RAN-4M-030	25	30	26
56	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-6-mieng.jpg	120000.00	ACTIVE	GA-RAN-6M-030	20	30	26
57	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-9-mieng.jpg	170000.00	ACTIVE	GA-RAN-9M-030	15	30	26
58	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-truyen-thong.jpg	0.00	ACTIVE	GA-RAN-TT-030	100	30	27
59	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-cay-han.jpg	5000.00	ACTIVE	GA-RAN-CAY-030	50	30	27
60	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-mat-ong.jpg	8000.00	ACTIVE	GA-RAN-HONEY-030	30	30	27
61	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-han-2m.jpg	50000.00	ACTIVE	GA-HAN-2M-031	30	31	26
62	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ga-ran-han-4m.jpg	90000.00	ACTIVE	GA-HAN-4M-031	25	31	26
63	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/lau-tomyum-2-3ng.jpg	180000.00	ACTIVE	LAU-TY-2-3-033	15	33	29
64	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/lau-tomyum-4-5ng.jpg	280000.00	ACTIVE	LAU-TY-4-5-033	10	33	29
65	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/lau-tomyum-6-8ng.jpg	380000.00	ACTIVE	LAU-TY-6-8-033	8	33	29
66	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/sashimi-8-mieng.jpg	120000.00	ACTIVE	SASHIMI-8M-035	20	35	33
67	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/sashimi-12-mieng.jpg	180000.00	ACTIVE	SASHIMI-12M-035	15	35	33
68	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/sashimi-16-mieng.jpg	240000.00	ACTIVE	SASHIMI-16M-035	10	35	33
69	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/shoyu-ramen-std.jpg	55000.00	ACTIVE	SHOYU-RAMEN-038	25	38	35
70	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ramen-khong-cay.jpg	0.00	ACTIVE	RAMEN-0CAY-038	50	38	37
71	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ramen-cay-vua.jpg	0.00	ACTIVE	RAMEN-CAY-VUA-038	50	38	37
72	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/ramen-cay-nhieu.jpg	0.00	ACTIVE	RAMEN-CAY-NHIEU-038	30	38	37
73	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tonkotsu-ramen-std.jpg	65000.00	ACTIVE	TONKOTSU-RAMEN-039	15	39	35
74	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tonkotsu-khong-cay.jpg	0.00	ACTIVE	TONKOTSU-0CAY-039	50	39	37
75	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/sinh-to-bo-std.jpg	28000.00	ACTIVE	SINH-TO-BO-045	50	45	\N
76	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/sinh-to-dau-std.jpg	32000.00	ACTIVE	SINH-TO-DAU-046	50	46	\N
77	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/tiramisu-std.jpg	45000.00	ACTIVE	TIRAMISU-047	30	47	\N
78	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/salad-caesar-std.jpg	65000.00	ACTIVE	SALAD-CAESAR-049	25	49	\N
79	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/xoi-ga-std.jpg	25000.00	ACTIVE	XOI-GA-041	40	41	\N
80	2025-09-23 21:57:11.157707	2025-09-23 21:57:11.157707	/images/chao-ga-tan-std.jpg	28000.00	ACTIVE	CHAO-GA-TAN-043	35	43	\N
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token (id, created_at, updated_at, expiration_time, token, token_type, account_id) FROM stdin;
15	2025-09-22 21:42:51.863067	2025-09-22 21:42:51.863067	2025-09-29 21:42:51.8483	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImtpZW4wNjExMjAwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTg1NTIxNzEsImV4cCI6MTc1OTE1Njk3MX0.UfKBt4iVgLyKk2doF6A9p9hrNZcSBMNWv62kXLeG5XQ	REFRESH_TOKEN	334709391
16	2025-09-22 21:52:01.460376	2025-09-22 21:52:01.460376	2025-09-29 21:52:01.458381	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImtpZW4wNjExMjAwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTg1NTI3MjEsImV4cCI6MTc1OTE1NzUyMX0.v2inV2Q8nHPOjB-2okWHiePLj-VxbMJDa4TYQJzFW68	REFRESH_TOKEN	334709391
17	2025-09-22 23:17:32.860074	2025-09-22 23:17:32.860074	2025-09-29 23:17:32.836	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImtpZW4wNjExMjAwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTg1NTc4NTIsImV4cCI6MTc1OTE2MjY1Mn0.uq4mXPRgaaejCyUK6KuuH9ecfxR7QIee5ltV5U5UdX8	REFRESH_TOKEN	334709391
\.


--
-- Data for Name: user_information; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_information (id, created_at, updated_at, address, fullname, gender, is_default, phone_number, account_id) FROM stdin;
\.


--
-- Data for Name: variant_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_options (id, created_at, updated_at, name, product_categories_id) FROM stdin;
1	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại phở	1
2	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Kích cỡ	1
3	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Topping thêm	1
4	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại bánh mì	3
5	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Nước uống kèm	3
6	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại cơm tấm	4
7	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Combo	4
8	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Kích cỡ pizza	36
9	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Đế pizza	36
10	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Topping thêm	36
11	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Kích cỡ pizza	37
12	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Đế pizza	37
13	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại burger	38
14	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Set combo	38
15	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại burger gà	39
16	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Set combo	39
17	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size	41
18	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ ngọt	41
19	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Topping	41
20	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size	42
21	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ ngọt	42
22	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size	43
23	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ đậm	43
24	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size	44
25	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Tỷ lệ sữa	44
26	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Số miếng	75
27	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Vị	75
28	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Combo	75
29	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size nồi	15
30	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ cay	15
31	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Size nồi	16
32	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ cay	16
33	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Set sushi	25
34	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại cá	25
35	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Loại nước dùng	27
36	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Topping	27
37	2025-09-23 21:50:24.676831	2025-09-23 21:50:24.676831	Độ cay	27
\.


--
-- Data for Name: variant_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_values (id, created_at, updated_at, price, stock_quantity, value, variant_options_id) FROM stdin;
1	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	45000.00	50	Phở bò tái	1
2	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	45000.00	50	Phở bò chín	1
3	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	40000.00	30	Phở gà	1
4	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	55000.00	25	Phở đặc biệt	1
5	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Nhỏ	2
6	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	5000.00	100	Vừa	2
7	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	10000.00	100	Lớn	2
8	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	15000.00	50	Thêm thịt	3
9	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	8000.00	50	Thêm trứng	3
10	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	5000.00	50	Thêm rau thơm	3
11	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	25000.00	40	Bánh mì thịt nướng	4
12	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	20000.00	40	Bánh mì pate	4
13	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	18000.00	30	Bánh mì trứng	4
14	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	35000.00	20	Bánh mì đặc biệt	4
15	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Không	5
16	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	10000.00	50	Nước ngọt	5
17	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	15000.00	30	Cà phê sữa	5
18	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	35000.00	30	Cơm tấm sườn	6
19	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	32000.00	30	Cơm tấm bì	6
20	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	45000.00	20	Cơm tấm đặc biệt	6
21	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	150000.00	20	Size S (20cm)	8
22	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	220000.00	15	Size M (25cm)	8
23	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	320000.00	10	Size L (30cm)	8
24	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	180000.00	20	Size S (20cm)	11
25	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	250000.00	15	Size M (25cm)	11
26	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	350000.00	10	Size L (30cm)	11
27	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	50	Đế mỏng	9
28	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	15000.00	50	Đế dày	9
29	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	25000.00	30	Đế phô mai	9
30	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	50	Đế mỏng	12
31	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	20000.00	50	Đế dày	12
32	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	65000.00	25	Burger bò classic	13
33	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	75000.00	20	Burger bò BBQ	13
34	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	95000.00	15	Double burger	13
35	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	50	Không combo	14
36	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	25000.00	50	Combo khoai + nước	14
37	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	35000.00	30	Combo khoai + nước + salad	14
38	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	25000.00	50	Combo khoai + nước	16
39	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Size M	17
40	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	8000.00	100	Size L	17
41	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	15000.00	50	Size XL	17
42	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Size M	20
43	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	10000.00	100	Size L	20
44	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	0% đường	18
45	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	50% đường	18
46	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	100% đường	18
47	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	0% đường	21
48	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	70% đường	21
49	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	100% đường	21
50	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	5000.00	100	Trân châu đen	19
51	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	5000.00	100	Trân châu trắng	19
52	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	8000.00	50	Thạch dừa	19
53	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	10000.00	30	Pudding	19
54	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Nhỏ	22
55	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	8000.00	100	Lớn	22
56	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Nhỏ	24
57	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	10000.00	100	Lớn	24
58	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	45000.00	30	2 miếng	26
59	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	85000.00	25	4 miếng	26
60	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	120000.00	20	6 miếng	26
61	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	170000.00	15	9 miếng	26
62	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	100	Gà giòn truyền thống	27
63	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	5000.00	50	Gà cay Hàn Quốc	27
64	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	8000.00	30	Gà mật ong	27
65	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	180000.00	15	Nồi 2-3 người	29
66	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	280000.00	10	Nồi 4-5 người	29
67	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	380000.00	8	Nồi 6-8 người	29
68	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	120000.00	20	Set 8 miếng	33
69	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	180000.00	15	Set 12 miếng	33
70	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	240000.00	10	Set 16 miếng	33
71	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	55000.00	25	Shoyu (nước tương)	35
72	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	60000.00	20	Miso	35
73	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	65000.00	15	Tonkotsu	35
74	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	50	Không cay	37
75	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	50	Cay vừa	37
76	2025-09-23 21:50:33.995253	2025-09-23 21:50:33.995253	0.00	30	Cay nhiều	37
\.


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_id_seq', 17, true);


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
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_variant_values product_variant_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_values
    ADD CONSTRAINT product_variant_values_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: user_information uk7obrv2bto76gske9rvdtxne9h; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT uk7obrv2bto76gske9rvdtxne9h UNIQUE (phone_number);


--
-- Name: product_variant_values ukimiuspptle1cysjsdxkmls3q; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_values
    ADD CONSTRAINT ukimiuspptle1cysjsdxkmls3q UNIQUE (variant_id, value_id);


--
-- Name: token ukpddrhgwxnms2aceeku9s2ewy5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT ukpddrhgwxnms2aceeku9s2ewy5 UNIQUE (token);


--
-- Name: account ukq0uja26qgu1atulenwup9rxyr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT ukq0uja26qgu1atulenwup9rxyr UNIQUE (email);


--
-- Name: user_information user_information_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT user_information_pkey PRIMARY KEY (id);


--
-- Name: variant_options variant_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_options
    ADD CONSTRAINT variant_options_pkey PRIMARY KEY (id);


--
-- Name: variant_values variant_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_values
    ADD CONSTRAINT variant_values_pkey PRIMARY KEY (id);


--
-- Name: order_items fk1ge45n6sknhncx1xsgr0180f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk1ge45n6sknhncx1xsgr0180f7 FOREIGN KEY (variant_values_id) REFERENCES public.variant_values(id);


--
-- Name: payment fk33pd2iqamm9gp5c14r1catra2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fk33pd2iqamm9gp5c14r1catra2 FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- Name: product_variant_values fk41tyguq05024y1jplvso2g897; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_values
    ADD CONSTRAINT fk41tyguq05024y1jplvso2g897 FOREIGN KEY (value_id) REFERENCES public.variant_values(id);


--
-- Name: order fk4c9jpp9nlheu0m0jkioa594en; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT fk4c9jpp9nlheu0m0jkioa594en FOREIGN KEY (user_infomation_id) REFERENCES public.user_information(id);


--
-- Name: order_items fk6qgid40p71s8fth69qnthutb9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk6qgid40p71s8fth69qnthutb9 FOREIGN KEY (product_variants_id) REFERENCES public.product_variants(id);


--
-- Name: product_categories fk7cpkh0ajt3apyej1vtjsvbbeb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT fk7cpkh0ajt3apyej1vtjsvbbeb FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- Name: variant_values fkb3mkmns9dea3bvgx1ovhuyrwd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_values
    ADD CONSTRAINT fkb3mkmns9dea3bvgx1ovhuyrwd FOREIGN KEY (variant_options_id) REFERENCES public.variant_options(id);


--
-- Name: cart_items fkc6cffk5kuuetrf9qyni711l5v; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkc6cffk5kuuetrf9qyni711l5v FOREIGN KEY (product_variants_id) REFERENCES public.product_variants(id);


--
-- Name: variant_options fkf6t5apt2rg384945yrj9596du; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_options
    ADD CONSTRAINT fkf6t5apt2rg384945yrj9596du FOREIGN KEY (product_categories_id) REFERENCES public.product_categories(id);


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
-- Name: product_variants fkheofewqalipian32jppjhe4jx; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkheofewqalipian32jppjhe4jx FOREIGN KEY (variant_option_id) REFERENCES public.variant_options(id);


--
-- Name: user_information fkhn9fqhsqg9l1h8uem9qx3n5p1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_information
    ADD CONSTRAINT fkhn9fqhsqg9l1h8uem9qx3n5p1 FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- Name: product fkim6feqgc4be9jfobe993j4os2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT fkim6feqgc4be9jfobe993j4os2 FOREIGN KEY (product_categories_id) REFERENCES public.product_categories(id);


--
-- Name: order_items fkjg8ob3r0ws22krbj2xu30nhi1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkjg8ob3r0ws22krbj2xu30nhi1 FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- Name: payment fkjii2n6db6cje3km5ybsbgo8cl; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fkjii2n6db6cje3km5ybsbgo8cl FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id);


--
-- Name: cart_items fkjrqtldpxxnw4miliv6peo94ty; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkjrqtldpxxnw4miliv6peo94ty FOREIGN KEY (variant_values_id) REFERENCES public.variant_values(id);


--
-- Name: product_variants fkjxq4wg24xktvlslcdyyc4nr7r; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkjxq4wg24xktvlslcdyyc4nr7r FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: product_variant_values fkpbp54igkobql1af2fpow658fu; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_values
    ADD CONSTRAINT fkpbp54igkobql1af2fpow658fu FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: carts fktbh18csnlmy9mre0klfe4m941; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fktbh18csnlmy9mre0klfe4m941 FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- PostgreSQL database dump complete
--

\unrestrict WpqpD0eUK5CC4PiFwXmNWANZruxoeShgtOiHjFNOgLOAf00ArDVfMvwXID6ixTc

