-- Seed data for local development
-- Covers all edge cases: full/partial/minimal data, varying promotion counts, mixed event shapes

-- Seed user
INSERT INTO users (id, email, name) VALUES
  ('seed_user_001', 'admin@oggiortona.com', 'Admin Seed');

-- ============================================================
-- RESTAURANTS
-- ============================================================

-- R1: Full data, menuUrl, 6 promotions (2 per type)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, menu_url, owner_id) VALUES
  ('Trattoria Da Mario', 'Cucina tradizionale abruzzese con vista sul porto. Specialita di pesce e piatti della tradizione preparati con ingredienti locali.', 'trattoria', 2, '+39 085 906 1234', 'Via Porto, 12, Ortona', 42.3541, 14.4037, '{"lunedi":null,"martedi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"23:00"},"mercoledi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"23:00"},"giovedi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"23:00"},"venerdi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"23:00"},"sabato":{"open":"12:00","close":"15:30","open2":"19:00","close2":"23:30"},"domenica":{"open":"12:00","close":"15:30","open2":null,"close2":null}}', 'https://trattoriadamario.it/menu', 'seed_user_001');

-- R2: Full data, 5 promotions (1 special, 2 deal, 2 news)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, owner_id) VALUES
  ('Pizzeria Il Forno', 'Pizza napoletana cotta a legna nel forno a 500 gradi', 'pizzeria', 1, '+39 085 906 5678', 'Corso Matteotti, 45, Ortona', 42.3555, 14.4020, '{"lunedi":{"open":"18:00","close":"23:00","open2":null,"close2":null},"martedi":{"open":"18:00","close":"23:00","open2":null,"close2":null},"mercoledi":null,"giovedi":{"open":"18:00","close":"23:00","open2":null,"close2":null},"venerdi":{"open":"18:00","close":"23:30","open2":null,"close2":null},"sabato":{"open":"12:00","close":"15:00","open2":"18:00","close2":"23:30"},"domenica":{"open":"12:00","close":"15:00","open2":"18:00","close2":"23:00"}}', 'seed_user_001');

-- R3: Full data, multi-type, 4 promotions (1 special, 2 deal, 1 news)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, owner_id) VALUES
  ('Bar Centrale', 'Colazioni, aperitivi, gelato artigianale e caffetteria nel cuore di Ortona', 'bar,gelateria', 1, '+39 085 906 9012', 'Piazza della Repubblica, 8, Ortona', 42.3548, 14.4025, '{"lunedi":{"open":"06:30","close":"21:00","open2":null,"close2":null},"martedi":{"open":"06:30","close":"21:00","open2":null,"close2":null},"mercoledi":{"open":"06:30","close":"21:00","open2":null,"close2":null},"giovedi":{"open":"06:30","close":"21:00","open2":null,"close2":null},"venerdi":{"open":"06:30","close":"22:00","open2":null,"close2":null},"sabato":{"open":"07:00","close":"22:00","open2":null,"close2":null},"domenica":{"open":"07:00","close":"13:00","open2":null,"close2":null}}', 'seed_user_001');

-- R4: Full data, menuUrl, 3 promotions (1 per type)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, menu_url, owner_id) VALUES
  ('Ristorante La Terrazza', 'Pesce fresco e piatti di mare con terrazza panoramica sul golfo', 'ristorante', 3, '+39 085 906 3456', 'Via Orientale, 22, Ortona', 42.3535, 14.4045, '{"lunedi":null,"martedi":null,"mercoledi":{"open":"12:30","close":"14:30","open2":"19:30","close2":"22:30"},"giovedi":{"open":"12:30","close":"14:30","open2":"19:30","close2":"22:30"},"venerdi":{"open":"12:30","close":"14:30","open2":"19:30","close2":"23:00"},"sabato":{"open":"12:30","close":"15:00","open2":"19:30","close2":"23:00"},"domenica":{"open":"12:30","close":"15:00","open2":null,"close2":null}}', 'https://laterrazza.it/menu.pdf', 'seed_user_001');

-- R5: No phone, no menuUrl, 2 promotions (1 deal, 1 news)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, owner_id) VALUES
  ('Dolce Vita', 'Gelato artigianale, pasticceria e caffetteria con ingredienti locali', 'gelateria,pasticceria,bar', 1, NULL, 'Lungomare dei Saraceni, 5, Ortona', 42.3530, 14.4050, '{"lunedi":{"open":"10:00","close":"22:00","open2":null,"close2":null},"martedi":{"open":"10:00","close":"22:00","open2":null,"close2":null},"mercoledi":{"open":"10:00","close":"22:00","open2":null,"close2":null},"giovedi":{"open":"10:00","close":"22:00","open2":null,"close2":null},"venerdi":{"open":"10:00","close":"23:00","open2":null,"close2":null},"sabato":{"open":"10:00","close":"23:00","open2":null,"close2":null},"domenica":{"open":"10:00","close":"23:00","open2":null,"close2":null}}', 'seed_user_001');

-- R6: No coordinates, 1 promotion (special only)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, owner_id) VALUES
  ('Pasticceria Abruzzo', 'Dolci tipici abruzzesi e cornetti freschi ogni mattina', 'pasticceria', 1, '+39 085 906 2345', 'Via Roma, 33, Ortona', NULL, NULL, '{"lunedi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"martedi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"mercoledi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"giovedi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"venerdi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"sabato":{"open":"07:00","close":"13:00","open2":"16:00","close2":"20:00"},"domenica":{"open":"07:30","close":"13:00","open2":null,"close2":null}}', 'seed_user_001');

-- R7: Minimal (no description, no phone, no coordinates, no menuUrl), 0 promotions
INSERT INTO restaurants (name, type, price_range, address, latitude, longitude, opening_hours, owner_id) VALUES
  ('Pescheria Adriatica', 'pescheria', 2, 'Via del Porto, 3, Ortona', NULL, NULL, '{"lunedi":{"open":"07:00","close":"13:00","open2":null,"close2":null},"martedi":{"open":"07:00","close":"13:00","open2":null,"close2":null},"mercoledi":{"open":"07:00","close":"13:00","open2":null,"close2":null},"giovedi":{"open":"07:00","close":"13:00","open2":null,"close2":null},"venerdi":{"open":"07:00","close":"13:00","open2":"16:00","close2":"19:00"},"sabato":{"open":"07:00","close":"13:00","open2":null,"close2":null},"domenica":null}', 'seed_user_001');

-- R8: Full data, 0 promotions, INACTIVE (pending approval)
INSERT INTO restaurants (name, description, type, price_range, phone, address, latitude, longitude, opening_hours, owner_id, active, approved) VALUES
  ('Trattoria del Castello', 'Cucina casalinga e pizzeria vicino al Castello Aragonese', 'trattoria,pizzeria', 2, '+39 085 906 4567', 'Via del Castello, 7, Ortona', 42.3560, 14.4010, '{"lunedi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"22:30"},"martedi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"22:30"},"mercoledi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"22:30"},"giovedi":null,"venerdi":{"open":"12:00","close":"15:00","open2":"19:00","close2":"23:00"},"sabato":{"open":"12:00","close":"15:30","open2":"19:00","close2":"23:00"},"domenica":{"open":"12:00","close":"15:30","open2":null,"close2":null}}', 'seed_user_001', 0, 0);

-- ============================================================
-- PROMOTIONS
-- ============================================================

-- R1 (Trattoria Da Mario): 6 promotions — 2 special, 2 deal, 2 news
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (1, 'special', 'Arrosticini di pecora con patate al forno', NULL, 12.00, date('now'), date('now'), '12:00', '15:00'),
  (1, 'special', 'Spaghetti alle vongole veraci', 'Vongole fresche del porto di Ortona', 14.00, date('now'), date('now'), '19:00', '22:00'),
  (1, 'deal', 'Pranzo completo 15 euro', 'Primo, secondo, contorno, acqua e caffe inclusi', NULL, date('now'), date('now', '+3 days'), '12:00', '15:00'),
  (1, 'deal', 'Vino della casa omaggio', 'Un quarto di vino gratis con ogni menu fisso', NULL, date('now'), date('now', '+1 day'), NULL, NULL),
  (1, 'news', 'Nuovo menu autunnale', 'Abbiamo rinnovato il menu con piatti di stagione a base di funghi porcini e tartufo', NULL, date('now'), date('now', '+7 days'), NULL, NULL),
  (1, 'news', 'Serata karaoke venerdi', 'Ogni venerdi sera dalle 21 karaoke con DJ Marco', NULL, date('now'), date('now', '+5 days'), '21:00', '23:30');

-- R2 (Pizzeria Il Forno): 5 promotions — 1 special, 2 deal, 2 news
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (2, 'special', 'Pizza del giorno: Diavola con nduja', NULL, 9.50, date('now'), date('now'), NULL, NULL),
  (2, 'deal', '2x1 Margherita', 'Ogni martedi sera: due margherite al prezzo di una', NULL, date('now'), date('now', '+1 day'), '18:00', '23:00'),
  (2, 'deal', 'Flash: Pizza + birra 10 euro', 'Offerta lampo valida solo oggi', NULL, date('now'), date('now'), '18:00', '21:00'),
  (2, 'news', 'Nuova pizza al padellino', 'Provate la nostra pizza al padellino in stile torinese', NULL, date('now'), date('now', '+4 days'), NULL, NULL),
  (2, 'news', 'Aperto anche a pranzo nel weekend', NULL, NULL, date('now'), date('now', '+2 days'), NULL, NULL);

-- R3 (Bar Centrale): 4 promotions — 1 special, 2 deal, 1 news
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (3, 'special', 'Cornetto integrale con crema di pistacchio', NULL, 2.50, date('now'), date('now'), '06:30', '11:00'),
  (3, 'deal', 'Aperitivo 5 euro', 'Spritz o Negroni con tagliere incluso, tutti i venerdi', NULL, date('now'), date('now', '+1 day'), '18:00', '20:00'),
  (3, 'deal', 'Colazione completa 3.50 euro', 'Cornetto + cappuccino, valido dal lunedi al venerdi', NULL, date('now'), date('now', '+5 days'), '06:30', '10:00'),
  (3, 'news', 'Diretta Serie A', 'Ogni weekend trasmettiamo le partite su maxischermo', NULL, date('now'), date('now', '+3 days'), NULL, NULL);

-- R4 (Ristorante La Terrazza): 3 promotions — 1 per type
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (4, 'special', 'Brodetto di pesce alla ortonese', 'Ricetta tradizionale con sette tipi di pesce', 18.00, date('now'), date('now'), NULL, NULL),
  (4, 'deal', 'Menu degustazione 35 euro', 'Antipasto, primo, secondo di pesce e dolce. Solo questo weekend', NULL, date('now'), date('now', '+2 days'), '19:30', '22:30'),
  (4, 'news', 'Terrazza estiva aperta', 'La terrazza panoramica e di nuovo disponibile per cena', NULL, date('now'), date('now', '+6 days'), NULL, NULL);

-- R5 (Dolce Vita): 2 promotions — 1 deal, 1 news
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (5, 'deal', 'Gelato + Caffe 3.50 euro', 'Coppa due gusti con caffe espresso', 3.50, date('now'), date('now', '+3 days'), NULL, NULL),
  (5, 'news', 'Nuovi gusti gelato', 'Pistacchio di Bronte e nocciola delle Langhe ora disponibili', NULL, date('now'), date('now', '+4 days'), NULL, NULL);

-- R6 (Pasticceria Abruzzo): 1 promotion — special only
INSERT INTO promotions (restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end) VALUES
  (6, 'special', 'Bocconotto abruzzese', NULL, 2.00, date('now'), date('now'), '07:00', '13:00');

-- R7 (Pescheria): 0 promotions
-- R8 (Trattoria del Castello): 0 promotions (inactive)

-- ============================================================
-- EVENTS
-- ============================================================

-- E1: Full data — multi-day, all fields, coordinates, phone, price, link, highlighted
INSERT INTO events (title, description, date_start, date_end, time_start, time_end, address, phone, latitude, longitude, category, price, link, owner_id, highlighted) VALUES
  ('Sagra del Pesce', 'La tradizionale sagra del pesce fritto con musica dal vivo e stand gastronomici lungo il porto. Ingresso libero per i bambini sotto i 10 anni.', date('now', '+2 days'), date('now', '+3 days'), '18:00', '23:00', 'Porto di Ortona', '+39 085 906 1111', 42.3538, 14.4042, 'cibo', 5.00, 'https://sagradelpesce.ortona.it', 'seed_user_001', 1);

-- E2: Full data — single day, times, coordinates, phone, no price, no link
INSERT INTO events (title, description, date_start, date_end, time_start, time_end, address, phone, latitude, longitude, category, owner_id) VALUES
  ('Concerto al Castello', 'Musica classica nel cortile del Castello Aragonese con orchestra da camera', date('now', '+5 days'), NULL, '21:00', '23:00', 'Castello Aragonese, Ortona', '+39 085 906 2222', 42.3562, 14.4008, 'cultura', 'seed_user_001');

-- E3: No coordinates, no phone, no description, with times
INSERT INTO events (title, date_start, date_end, time_start, time_end, address, category, owner_id) VALUES
  ('Mercato del Contadino', date('now', '+1 day'), NULL, '08:00', '13:00', 'Piazza della Repubblica, Ortona', 'cibo', 'seed_user_001');

-- E4: No times, with coordinates, with description, with price
INSERT INTO events (title, description, date_start, date_end, address, latitude, longitude, category, price, owner_id) VALUES
  ('Mostra Fotografica: Ortona Antica', 'Raccolta di fotografie storiche della citta dal 1900 ad oggi. Ingresso libero.', date('now', '+3 days'), date('now', '+10 days'), 'Palazzo Farnese, Ortona', 42.3552, 14.4018, 'cultura', NULL, 'seed_user_001');

-- E5: Minimal — no description, no times, no coordinates, no phone, no price, no link
INSERT INTO events (title, date_start, address, category, owner_id) VALUES
  ('Torneo Scacchi', date('now', '+6 days'), 'Centro Sociale, Via Garibaldi 15, Ortona', 'sport', 'seed_user_001');

-- E6: Today event — happening now, with times and coordinates
INSERT INTO events (title, description, date_start, time_start, time_end, address, latitude, longitude, category, owner_id) VALUES
  ('Yoga al Tramonto', 'Sessione di yoga all aperto sulla scogliera. Portare tappetino.', date('now'), '18:30', '19:30', 'Punta della Penna, Ortona', 42.3520, 14.4060, 'sport', 'seed_user_001');

-- E7: Multi-day event with link, no times
INSERT INTO events (title, description, date_start, date_end, address, category, link, phone, owner_id) VALUES
  ('Festival del Vino Abruzzese', 'Tre giorni di degustazioni con cantine da tutto l Abruzzo', date('now', '+8 days'), date('now', '+10 days'), 'Piazza San Tommaso, Ortona', 'cibo', 'https://festivalvino.abruzzo.it', '+39 085 906 3333', 'seed_user_001');

-- E8: Inactive event (pending approval)
INSERT INTO events (title, description, date_start, time_start, time_end, address, category, owner_id, active, approved) VALUES
  ('Concerto Rock', 'Band locali al parco comunale', date('now', '+4 days'), '20:00', '23:30', 'Parco Comunale, Ortona', 'cultura', 'seed_user_001', 0, 0);
