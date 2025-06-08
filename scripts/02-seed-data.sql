-- Insert sample categories
INSERT INTO categories (name_en, name_ar, slug) VALUES
('Politics', 'سياسة', 'politics'),
('Technology', 'تكنولوجيا', 'technology'),
('Sports', 'رياضة', 'sports'),
('Business', 'أعمال', 'business'),
('Culture', 'ثقافة', 'culture');

-- Insert site settings
INSERT INTO settings (key, value_en, value_ar) VALUES
('site_title', 'Global News', 'الأخبار العالمية'),
('site_description', 'Your trusted source for global news', 'مصدرك الموثوق للأخبار العالمية'),
('default_language', 'en', 'en');

-- Insert sample articles
INSERT INTO articles (title_en, title_ar, content_en, content_ar, excerpt_en, excerpt_ar, image_url, category_id, is_featured) VALUES
(
  'Breaking: Major Technology Breakthrough Announced',
  'عاجل: الإعلان عن اختراق تكنولوجي كبير',
  'In a groundbreaking announcement today, researchers have unveiled a revolutionary technology that promises to transform the way we interact with digital devices. This breakthrough represents years of dedicated research and development, bringing us closer to a more connected and efficient future.

The new technology, developed by a team of international scientists, combines artificial intelligence with quantum computing principles to create unprecedented processing capabilities. Early tests show remarkable improvements in speed and efficiency compared to current systems.

Industry experts are calling this development a game-changer that could reshape multiple sectors including healthcare, finance, and communications. The implications of this breakthrough extend far beyond what we initially imagined.',
  'في إعلان رائد اليوم، كشف الباحثون عن تقنية ثورية تعد بتحويل الطريقة التي نتفاعل بها مع الأجهزة الرقمية. يمثل هذا الاختراق سنوات من البحث والتطوير المتفاني، مما يقربنا من مستقبل أكثر ترابطاً وكفاءة.

التقنية الجديدة، التي طورها فريق من العلماء الدوليين، تجمع بين الذكاء الاصطناعي ومبادئ الحوسبة الكمية لإنشاء قدرات معالجة غير مسبوقة. تظهر الاختبارات المبكرة تحسينات ملحوظة في السرعة والكفاءة مقارنة بالأنظمة الحالية.

يصف خبراء الصناعة هذا التطوير بأنه يغير قواعد اللعبة ويمكن أن يعيد تشكيل قطاعات متعددة بما في ذلك الرعاية الصحية والمالية والاتصالات.',
  'Revolutionary technology breakthrough promises to transform digital interaction and processing capabilities.',
  'اختراق تكنولوجي ثوري يعد بتحويل التفاعل الرقمي وقدرات المعالجة.',
  '/placeholder.svg?height=400&width=600',
  2,
  true
),
(
  'Global Economic Summit Addresses Climate Change',
  'القمة الاقتصادية العالمية تتناول تغير المناخ',
  'World leaders gathered at the annual Global Economic Summit to discuss pressing issues surrounding climate change and sustainable development. The three-day conference brought together heads of state, business leaders, and environmental experts to forge new partnerships and commitments.

Key topics included renewable energy investments, carbon reduction strategies, and the economic implications of climate policies. Several breakthrough agreements were announced, including a multi-billion dollar fund for developing nations to transition to clean energy.

The summit concluded with a joint declaration emphasizing the urgent need for coordinated global action. Participants committed to ambitious targets for reducing greenhouse gas emissions and promoting sustainable economic growth.',
  'اجتمع قادة العالم في القمة الاقتصادية العالمية السنوية لمناقشة القضايا الملحة المحيطة بتغير المناخ والتنمية المستدامة. جمع المؤتمر الذي استمر ثلاثة أيام رؤساء الدول وقادة الأعمال وخبراء البيئة لتكوين شراكات والتزامات جديدة.

شملت المواضيع الرئيسية استثمارات الطاقة المتجددة واستراتيجيات تقليل الكربون والآثار الاقتصادية لسياسات المناخ. تم الإعلان عن عدة اتفاقيات رائدة، بما في ذلك صندوق بمليارات الدولارات للدول النامية للانتقال إلى الطاقة النظيفة.

اختتمت القمة بإعلان مشترك يؤكد على الحاجة الملحة للعمل العالمي المنسق. التزم المشاركون بأهداف طموحة لتقليل انبعاثات غازات الدفيئة وتعزيز النمو الاقتصادي المستدام.',
  'World leaders unite at economic summit to address climate change with new funding commitments.',
  'قادة العالم يتحدون في القمة الاقتصادية لمعالجة تغير المناخ بالتزامات تمويل جديدة.',
  '/placeholder.svg?height=400&width=600',
  4,
  true
),
(
  'Championship Finals Set Record Viewership',
  'نهائيات البطولة تحقق رقماً قياسياً في المشاهدة',
  'The highly anticipated championship finals broke all previous viewership records, with over 500 million people tuning in worldwide. The thrilling match showcased exceptional athleticism and sportsmanship, keeping viewers on the edge of their seats until the final moments.

Both teams delivered outstanding performances, with several record-breaking individual achievements throughout the game. The event featured state-of-the-art broadcasting technology, providing viewers with unprecedented access to the action through multiple camera angles and real-time statistics.

Social media engagement reached new heights, with millions of posts and interactions across all platforms. The championship has set a new standard for sports entertainment and global audience engagement.',
  'حطمت نهائيات البطولة المنتظرة بشدة جميع أرقام المشاهدة السابقة، حيث تابعها أكثر من 500 مليون شخص حول العالم. عرضت المباراة المثيرة قدرات رياضية استثنائية وروحاً رياضية عالية، مما أبقى المشاهدين في حالة ترقب حتى اللحظات الأخيرة.

قدم كلا الفريقين أداءً متميزاً، مع عدة إنجازات فردية قياسية طوال المباراة. تميز الحدث بتقنية بث متطورة، مما وفر للمشاهدين وصولاً غير مسبوق للحدث من خلال زوايا كاميرا متعددة وإحصائيات فورية.

وصل التفاعل على وسائل التواصل الاجتماعي إلى آفاق جديدة، مع ملايين المنشورات والتفاعلات عبر جميع المنصات. وضعت البطولة معياراً جديداً للترفيه الرياضي ومشاركة الجمهور العالمي.',
  'Championship finals achieve record-breaking viewership with over 500 million global viewers.',
  'نهائيات البطولة تحقق رقماً قياسياً في المشاهدة مع أكثر من 500 مليون مشاهد عالمي.',
  '/placeholder.svg?height=400&width=600',
  3,
  false
);
