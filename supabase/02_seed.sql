-- Seeds the 40 default supplement products.
-- Safe to re-run: uses ON CONFLICT (id) DO NOTHING.

insert into public.products (id, name, brand, price, category, tag, color, flavours, benefits, sort_order) values
-- Whey Protein
('whey-001','Gold Standard 100% Whey','Optimum Nutrition','₹3,299','Whey Protein','Best Seller','#00c8ff',array['Double Rich Chocolate','Vanilla Ice Cream','Strawberry','Cookies & Cream'],array['24g whey protein','Rapid recovery','Low sugar','Trusted formula'],10),
('whey-002','ISO 100 Whey Protein','Dymatize','₹3,799','Whey Protein','Premium','#00c8ff',array['Gourmet Chocolate','Birthday Cake','Cinnamon Bun','Vanilla'],array['Hydrolyzed whey isolate','Fast digestion','0g fat','Great for cutting'],20),
('whey-003','Whey Protein Plus','MuscleBlaze','₹2,499','Whey Protein','Value','#00c8ff',array['Rich Milk Chocolate','Mango','Strawberry','Café Mocha'],array['25g protein','Enhanced BCAAs','Great taste','Sustained energy'],30),
('whey-004','Impact Whey Protein','MyProtein','₹2,199','Whey Protein','Popular','#00c8ff',array['Chocolate Smooth','Banana','Vanilla','Salted Caramel','Cookies & Cream'],array['20g protein','30+ flavours','Low carbs','Muscle support'],40),
('whey-005','Performance Whey','Ultimate Nutrition','₹3,199','Whey Protein','Muscle','#00c8ff',array['Chocolate Crème','French Vanilla','Strawberry'],array['High protein','Great mixability','Muscle recovery','Low lactose'],50),
('whey-006','Whey Advanced','Gaspari','₹3,599','Whey Protein','Strength','#00c8ff',array['Chocolate','Vanilla','Cookies & Cream'],array['20g protein','Added amino acids','Lean gains','Premium formula'],60),

-- Creatine
('creatine-001','Micronized Creatine','Optimum Nutrition','₹1,199','Creatine','Strength','#7c3aed',array['Unflavoured'],array['5g creatine','Pure micronized','Faster uptake','Improves power'],110),
('creatine-002','Creatine Monohydrate','Thorne Research','₹1,499','Creatine','Certified','#7c3aed',array['Unflavoured'],array['High purity','No fillers','Endurance boost','Muscle strength'],120),
('creatine-003','Creatine HCL','MuscleTech','₹1,699','Creatine','Fast Absorb','#7c3aed',array['Unflavoured','Fruit Punch'],array['Superior solubility','Less bloat','Power gains','Stamina support'],130),
('creatine-004','Creatine Complex','MyProtein','₹1,399','Creatine','Combo','#7c3aed',array['Unflavoured','Berry Burst','Lemon'],array['Loaded with creatine','Carb recovery','Supports strength','Daily formula'],140),
('creatine-005','Peak Creatine','Cellucor','₹1,599','Creatine','Elite','#7c3aed',array['Unflavoured'],array['2100mg CEE','Muscle pump','Fast strength','Premium delivery'],150),
('creatine-006','Creatine Focus','Transparent Labs','₹1,799','Creatine','Pure','#7c3aed',array['Unflavoured'],array['100% creatine','No artificial sweeteners','Strength support','Recovery aid'],160),

-- Pre Workout
('pre-001','Pulse Pre-Workout','Legion Pulse','₹2,499','Pre Workout','Energy','#ff6b8a',array['Fruit Punch','Watermelon','Blue Raspberry','Tropical Storm'],array['350mg caffeine','Beta-alanine','L-citrulline','Pump support'],210),
('pre-002','C4 Original','Cellucor','₹1,899','Pre Workout','Popular','#ff6b8a',array['Fruit Punch','Icy Blue Razz','Pink Lemonade','Watermelon'],array['Explosive energy','Focus blend','Strength boost','Improved endurance'],220),
('pre-003','Pre-Kaged','Kaged','₹2,999','Pre Workout','Premium','#ff6b8a',array['Fruit Punch','Berry Blast','Cherry Bomb'],array['Clean energy','Nitric oxide','Endurance','Hydration support'],230),
('pre-004','Mr. Hyde','ProSupps','₹1,699','Pre Workout','Intense','#ff6b8a',array['Tropical Storm','Blue Razz Popsicle','Pixie Dust'],array['High caffeine','Extreme energy','Focus boost','Strength performance'],240),
('pre-005','Pre-Boost','Optimum','₹2,299','Pre Workout','Balance','#ff6b8a',array['Blueberry Lemonade','Fruit Punch','Sour Apple'],array['Nootropic blend','Pump enhancers','Endurance support','Great taste'],250),
('pre-006','Nitro Surge','BSN','₹1,799','Pre Workout','Performance','#ff6b8a',array['Cherry Limeade','Grape','Strawberry Kiwi'],array['Energy boost','Pump enhancement','Strength support','Focus complex'],260),

-- Multi Vitamins
('multi-001','Multivitamin Pro','Garden of Life','₹2,199','Multi Vitamins','Complete','#f97316',array['Tablet'],array['30+ nutrients','Made from whole food','Immune support','Energy boost'],310),
('multi-002','One Daily Multi','Optimum Nutrition','₹1,799','Multi Vitamins','Daily','#f97316',array['Tablet'],array['Balanced nutrition','Bone support','Skin health','Energy formula'],320),
('multi-003','Mega Men','GNC','₹2,299','Multi Vitamins','Men''s','#f97316',array['Tablet'],array['Heart support','Eye health','Muscle recovery','Immune support'],330),
('multi-004','Herbal Multi','HealthKart','₹1,699','Multi Vitamins','Natural','#f97316',array['Tablet'],array['Plant-based','Digestive enzymes','Stress support','Daily wellness'],340),
('multi-005','Daily Wellness','Himalaya','₹1,399','Multi Vitamins','Trusted','#f97316',array['Tablet'],array['Essential vitamins','Mineral support','Immunity','Energy focus'],350),
('multi-006','Multi Boost','Nature''s Bounty','₹1,999','Multi Vitamins','Complete','#f97316',array['Tablet'],array['Complete daily blend','Immune support','Energy','Metabolism'],360),

-- Peptides
('pep-001','Marine Collagen Peptides','Sports Research','₹3,499','Peptides','Skin & Joints','#fbbf24',array['Unflavoured','Lemon'],array['10g hydrolysed marine collagen','Type I peptides','Skin elasticity & hair strength','Joint comfort support'],410),
('pep-002','Bovine Collagen Peptides','Vital Proteins','₹2,899','Peptides','Recovery','#fbbf24',array['Unflavoured','Chocolate','Vanilla'],array['20g grass-fed collagen','Type I & III peptides','Faster muscle recovery','Bone & joint support'],420),
('pep-003','Creatine Peptides','MuscleTech','₹1,899','Peptides','Strength','#fbbf24',array['Unflavoured','Fruit Punch'],array['Bonded peptide form','Faster absorption than monohydrate','Lean strength gains','Reduced water retention'],430),
('pep-004','Glutamine Peptides','Optimum Nutrition','₹1,799','Peptides','Recovery','#fbbf24',array['Unflavoured'],array['5g glutamine peptides','Reduces muscle soreness','Supports gut health','Boosts immunity'],440),
('pep-005','Whey Protein Hydrolysate','Dymatize','₹4,199','Peptides','Rapid Absorb','#fbbf24',array['Chocolate','Vanilla','Strawberry'],array['Pre-digested whey peptides','Fastest absorption rate','Ideal for post-workout','30g protein per scoop'],450),
('pep-006','Casein Peptides','Optimum Nutrition','₹3,499','Peptides','Sustained Release','#fbbf24',array['Chocolate','Vanilla'],array['Slow-digesting micellar peptides','8-hour amino release','Anti-catabolic overnight','Lean muscle preservation'],460),
('pep-007','BCAA Peptides Plus','Scivation Xtend','₹2,299','Peptides','Recovery','#fbbf24',array['Watermelon Smash','Blue Raspberry','Mango Madness'],array['7g BCAAs in peptide form','Faster amino delivery','Reduces fatigue','Hydration electrolytes'],470),
('pep-008','Beef Protein Peptides','MuscleMeds Carnivor','₹3,299','Peptides','Lean Mass','#fbbf24',array['Chocolate','Vanilla','Fruit Punch'],array['23g beef protein isolate','Hydrolyzed peptide form','Lactose-free','Creatine and BCAAs included'],480),
('pep-009','Pea Protein Peptides','Naked Nutrition','₹2,599','Peptides','Vegan','#fbbf24',array['Unflavoured','Vanilla','Chocolate'],array['27g plant-based peptides','Allergen-free','Easy digestion','Complete amino profile'],490),
('pep-010','Hydrolyzed Collagen Type I & III','NeoCell Super Collagen','₹2,799','Peptides','Anti-Aging','#fbbf24',array['Tablet','Unflavoured Powder'],array['6g collagen Type I & III','Skin firmness & elasticity','Hair growth support','Nail strength'],500),

-- Others
('other-001','Omega 3 Fish Oil','Nordic Naturals','₹1,899','Others','Recovery','#22d97e',array['Lemon Softgel','Unflavoured'],array['2000mg EPA+DHA','Heart support','Brain health','Joint recovery'],510),
('other-002','BCAA Plus','Transparent Labs','₹1,699','Others','Recovery','#22d97e',array['Tropical Punch','Strawberry Lemonade','Blue Raspberry'],array['7g BCAAs','Muscle repair','Zero sugar','Hydration support'],520),
('other-003','Glutamine Core','Dymatize','₹1,499','Others','Repair','#22d97e',array['Unflavoured'],array['Supports recovery','Immune health','Muscle repair','Strength support'],530),
('other-004','ZMA Night','MuscleTech','₹1,299','Others','Sleep','#22d97e',array['Capsule'],array['Sleep support','Recovery','Testosterone support','Muscle growth'],540),
('other-005','CLA Lean','GNC','₹1,299','Others','Lean','#22d97e',array['Softgel'],array['Fat metabolism','Lean support','Natural blend','Weight management'],550),
('other-006','Collagen Boost','Vital Proteins','₹2,199','Others','Beauty','#22d97e',array['Unflavoured','Lemon','Berry'],array['Skin support','Joint health','Hair strength','Recovery'],560)
on conflict (id) do nothing;
