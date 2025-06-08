const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log("Creating database tables...");

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✓ Categories table created");

    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(500) NOT NULL,
        title_ar VARCHAR(500) NOT NULL,
        content_en TEXT NOT NULL,
        content_ar TEXT NOT NULL,
        excerpt_en TEXT,
        excerpt_ar TEXT,
        image_url VARCHAR(500),
        category_id INTEGER REFERENCES categories(id),
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✓ Articles table created");

    // Create settings table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value_en TEXT,
        value_ar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✓ Settings table created"); // Insert sample categories
    await sql`
      INSERT INTO categories (name_en, name_ar, slug) VALUES
      ('Libya', 'ليبيا', 'libya'),
      ('Politics', 'سياسة', 'politics'),
      ('Sports', 'رياضة', 'sports'),
      ('Economy', 'اقتصاد', 'economy'),
      ('Culture', 'ثقافة', 'culture')
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log("✓ Sample categories inserted");

    // Insert site settings
    await sql`
      INSERT INTO settings (key, value_en, value_ar) VALUES
      ('site_title', 'Akhbarna', 'أخبارنا'),
      ('site_description', 'Your trusted source for Libyan and global news', 'مصدرك الموثوق للأخبار الليبية والعالمية'),
      ('default_language', 'ar', 'ar')
      ON CONFLICT (key) DO NOTHING
    `;
    console.log("✓ Site settings inserted"); // Insert sample articles with images
    await sql`
      INSERT INTO articles (title_en, title_ar, content_en, content_ar, excerpt_en, excerpt_ar, image_url, category_id, is_featured) VALUES
      (
        'Libya Hosts International Economic Summit in Tripoli',
        'ليبيا تستضيف قمة اقتصادية دولية في طرابلس',
        'Tripoli, Libya - The Libyan capital hosted a major international economic summit this week, bringing together leaders from across the Mediterranean region to discuss trade partnerships and economic cooperation. The summit, held at the prestigious Corinthia Hotel, focused on rebuilding Libya''s economy and establishing new trade routes with neighboring countries. Prime Minister Abdul Hamid Dbeibeh welcomed delegates from over 20 countries, emphasizing Libya''s strategic position as a gateway between Africa and Europe. Key discussions centered around energy partnerships, infrastructure development, and investment opportunities in the post-conflict era. The summit concluded with several memorandums of understanding being signed, particularly in the oil and gas sector.',
        'طرابلس، ليبيا - استضافت العاصمة الليبية طرابلس قمة اقتصادية دولية كبرى هذا الأسبوع، جمعت قادة من جميع أنحاء منطقة البحر الأبيض المتوسط لمناقشة الشراكات التجارية والتعاون الاقتصادي. ركزت القمة، التي عُقدت في فندق كورينثيا المرموق، على إعادة بناء الاقتصاد الليبي وإنشاء طرق تجارية جديدة مع البلدان المجاورة. رحب رئيس الوزراء عبد الحميد الدبيبة بوفود من أكثر من 20 دولة، مؤكداً على الموقع الاستراتيجي لليبيا كبوابة بين أفريقيا وأوروبا. تركزت المناقشات الرئيسية حول شراكات الطاقة وتطوير البنية التحتية والفرص الاستثمارية في عصر ما بعد الصراع. اختتمت القمة بتوقيع عدة مذكرات تفاهم، خاصة في قطاع النفط والغاز.',
        'Libya hosts major international economic summit focusing on trade partnerships and economic cooperation with Mediterranean region.',
        'ليبيا تستضيف قمة اقتصادية دولية كبرى تركز على الشراكات التجارية والتعاون الاقتصادي مع منطقة البحر الأبيض المتوسط.',
        '/economic-summit.svg',
        4,
        true
      ),
      (
        'Historic Archaeological Discovery in Cyrenaica Region',
        'اكتشاف أثري تاريخي في منطقة برقة',
        'Benghazi, Libya - Archaeologists working in the ancient city of Cyrene have made a remarkable discovery that sheds new light on Libya''s rich historical heritage. The team, led by international researchers in collaboration with the Libyan Department of Antiquities, uncovered a well-preserved Roman villa complex dating back to the 3rd century AD. The site includes intricate mosaics, ancient inscriptions, and artifacts that provide insights into daily life during the Roman period. Dr. Amina Al-Sharif, head of the excavation team, described the find as "extraordinary" and noted that the mosaics are among the best-preserved examples found in North Africa. The discovery also includes a sophisticated water management system and evidence of early Christian symbols, suggesting the site''s continued importance through different historical periods.',
        'بنغازي، ليبيا - حقق علماء الآثار العاملون في مدينة قورينا القديمة اكتشافاً رائعاً يلقي ضوءاً جديداً على التراث التاريخي الغني لليبيا. الفريق، بقيادة باحثين دوليين بالتعاون مع مصلحة الآثار الليبية، كشف عن مجمع فيلا رومانية محفوظة جيداً يعود تاريخها إلى القرن الثالث الميلادي. يشمل الموقع فسيفساء معقدة ونقوش قديمة وقطع أثرية توفر نظرة ثاقبة على الحياة اليومية خلال الفترة الرومانية. وصفت الدكتورة أمينة الشريف، رئيسة فريق التنقيب، الاكتشاف بأنه "استثنائي" وأشارت إلى أن الفسيفساء من بين أفضل الأمثلة المحفوظة الموجودة في شمال أفريقيا. يشمل الاكتشاف أيضاً نظام إدارة مياه متطور وأدلة على رموز مسيحية مبكرة، مما يشير إلى أهمية الموقع المستمرة عبر فترات تاريخية مختلفة.',
        'Major archaeological discovery in Cyrenaica reveals well-preserved Roman villa complex with intricate mosaics from 3rd century AD.',
        'اكتشاف أثري كبير في برقة يكشف عن مجمع فيلا رومانية محفوظة جيداً مع فسيفساء معقدة من القرن الثالث الميلادي.',
        '/archaeology.svg',
        5,
        true
      ),
      (
        'Libyan National Football Team Qualifies for African Cup',
        'المنتخب الوطني الليبي لكرة القدم يتأهل لكأس أفريقيا',
        'Tripoli, Libya - The Libyan national football team secured their place in the upcoming African Cup of Nations after a thrilling 2-1 victory over their regional rivals in the final qualifying match. The match, played at the Tripoli International Stadium in front of 40,000 passionate fans, saw goals from captain Ahmed Al-Muntaser and rising star Omar Benali. This qualification marks Libya''s return to continental football after several years of absence due to various challenges. Coach Jalal Damja expressed his pride in the team''s performance and dedication throughout the qualifying campaign. The team''s success has united Libyans across the country, with celebrations reported in major cities including Benghazi, Misrata, and Sabha. The African Cup of Nations will be held next year, and Libya is expected to face strong competition from traditional powerhouses like Egypt, Nigeria, and Morocco.',
        'طرابلس، ليبيا - ضمن المنتخب الوطني الليبي لكرة القدم مكانه في كأس الأمم الأفريقية القادمة بعد فوز مثير بنتيجة 2-1 على منافسيه الإقليميين في مباراة التأهل الأخيرة. شهدت المباراة، التي لُعبت في ملعب طرابلس الدولي أمام 40 ألف مشجع متحمس، هدفين من القائد أحمد المنتصر والنجم الصاعد عمر بن علي. يمثل هذا التأهل عودة ليبيا إلى كرة القدم القارية بعد عدة سنوات من الغياب بسبب تحديات مختلفة. أعرب المدرب جلال دامجة عن فخره بأداء الفريق وتفانيه طوال حملة التأهل. نجح الفريق في توحيد الليبيين في جميع أنحاء البلاد، حيث تم الإبلاغ عن احتفالات في المدن الكبرى بما في ذلك بنغازي ومصراتة وسبها. ستقام كأس الأمم الأفريقية العام المقبل، ومن المتوقع أن تواجه ليبيا منافسة قوية من القوى التقليدية مثل مصر ونيجيريا والمغرب.',
        'Libyan national team secures African Cup qualification with 2-1 victory, marking return to continental football after years of absence.',
        'المنتخب الوطني يضمن التأهل لكأس أفريقيا بفوز 2-1، مما يمثل العودة إلى كرة القدم القارية بعد سنوات من الغياب.',
        '/football.svg',
        3,
        false
      ),
      (
        'Revolutionary Solar Energy Project Launched in Sahara',
        'إطلاق مشروع طاقة شمسية ثوري في الصحراء',
        'Sabha, Libya - Libya has officially launched one of Africa''s largest solar energy projects in the heart of the Sahara Desert, marking a significant step towards renewable energy independence. The ambitious project, developed in partnership with international energy companies, spans over 1,000 square kilometers and is expected to generate enough clean energy to power major Libyan cities. The initiative is part of Libya''s broader strategy to diversify its energy portfolio beyond oil and gas. Minister of Energy Mohamed Al-Arfi announced that the project will create thousands of jobs and position Libya as a leader in renewable energy in the region. The solar farm utilizes cutting-edge photovoltaic technology and includes advanced energy storage systems to ensure consistent power supply. Environmental experts have praised the project as a model for sustainable development in arid regions.',
        'سبها، ليبيا - أطلقت ليبيا رسمياً أحد أكبر مشاريع الطاقة الشمسية في أفريقيا في قلب الصحراء الكبرى، مما يمثل خطوة مهمة نحو الاستقلال في الطاقة المتجددة. المشروع الطموح، المطور بالشراكة مع شركات الطاقة الدولية، يمتد على مساحة تزيد عن 1000 كيلومتر مربع ومن المتوقع أن ينتج طاقة نظيفة كافية لتشغيل المدن الليبية الكبرى. المبادرة جزء من استراتيجية ليبيا الأوسع لتنويع محفظة الطاقة بعيداً عن النفط والغاز. أعلن وزير الطاقة محمد العرفي أن المشروع سيخلق آلاف الوظائف ويضع ليبيا كرائدة في الطاقة المتجددة في المنطقة. تستخدم المزرعة الشمسية تكنولوجيا الخلايا الكهروضوئية المتطورة وتشمل أنظمة تخزين الطاقة المتقدمة لضمان إمداد الطاقة المستمر. أشاد خبراء البيئة بالمشروع كنموذج للتنمية المستدامة في المناطق القاحلة.',
        'Libya launches major solar energy project in Sahara Desert, marking significant step towards renewable energy independence.',
        'ليبيا تطلق مشروع طاقة شمسية كبير في الصحراء الكبرى، مما يمثل خطوة مهمة نحو الاستقلال في الطاقة المتجددة.',
        '/solar-energy.svg',
        4,
        false
      ),
      (
        'Ancient Manuscripts Digitized in Tripoli University Project',
        'رقمنة المخطوطات القديمة في مشروع جامعة طرابلس',
        'Tripoli, Libya - The University of Tripoli has completed a groundbreaking digital preservation project, successfully digitizing over 10,000 ancient manuscripts that chronicle Libya''s rich intellectual heritage. The three-year initiative, supported by UNESCO and international academic institutions, has made these precious documents accessible to researchers worldwide. The collection includes rare Islamic texts, historical chronicles, scientific treatises, and literary works dating from the 9th to 18th centuries. Professor Fatima Al-Zubaidi, who led the project, emphasized the importance of preserving these manuscripts for future generations. Many of the documents provide unique insights into North African scholarship, trade routes, and cultural exchanges during the medieval period. The digitized collection is now available through an online portal, making Libya''s intellectual treasures accessible to scholars and students globally.',
        'طرابلس، ليبيا - أكملت جامعة طرابلس مشروعاً رائداً للحفظ الرقمي، حيث نجحت في رقمنة أكثر من 10 آلاف مخطوطة قديمة تؤرخ للتراث الفكري الغني لليبيا. المبادرة التي استمرت ثلاث سنوات، بدعم من اليونسكو والمؤسسات الأكاديمية الدولية، جعلت هذه الوثائق الثمينة متاحة للباحثين في جميع أنحاء العالم. تشمل المجموعة نصوصاً إسلامية نادرة وسجلات تاريخية ورسائل علمية وأعمال أدبية تعود من القرن التاسع إلى الثامن عشر. أكدت البروفيسورة فاطمة الزبيدي، التي قادت المشروع، على أهمية الحفاظ على هذه المخطوطات للأجيال القادمة. تقدم العديد من الوثائق نظرة فريدة على المنح الدراسية في شمال أفريقيا وطرق التجارة والتبادلات الثقافية خلال فترة العصور الوسطى. المجموعة المرقمنة متاحة الآن من خلال بوابة إلكترونية، مما يجعل كنوز ليبيا الفكرية في متناول العلماء والطلاب على مستوى العالم.',
        'University of Tripoli completes digitization of 10,000 ancient manuscripts, making Libya''s intellectual heritage accessible worldwide.',
        'جامعة طرابلس تكمل رقمنة 10 آلاف مخطوطة قديمة، مما يجعل التراث الفكري الليبي متاحاً في جميع أنحاء العالم.',
        '/placeholder-logo.svg',
        5,
        false
      )
      ON CONFLICT (id) DO NOTHING
    `;
    console.log("✓ Sample article inserted");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("Your bilingual news website is now ready to go.");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
