"""Management command to seed CMS with real Durrani Welfare Trust content."""
from django.core.management.base import BaseCommand

from durrani_welfare_system.cms.models import (
    SiteSettings, AboutSection, Service, NewsPost, DonationCampaign
)


class Command(BaseCommand):
    help = 'Seed CMS with real Durrani Welfare Trust content from official documentation'

    def handle(self, *args, **options):
        self.stdout.write('Seeding CMS content with real DWT data...\n')
        self._seed_site_settings()
        self._seed_about_sections()
        self._seed_services()
        self._seed_news()
        self._seed_campaigns()
        self.stdout.write(self.style.SUCCESS('\n=== CMS content seeded successfully! ==='))

    # ------------------------------------------------------------------
    def _seed_site_settings(self):
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults={
                'organization_name': 'Durrani Welfare Trust',
                'tagline': 'Be-Saharon Ka Sahara — Serving Humanity with Compassion',
                'email': 'info@dwtrust.org',
                'phone_primary': '03129700108',
                'address': 'Konodas, Gilgit-Baltistan, Pakistan',
                'meta_description': (
                    'Durrani Welfare Trust — an NGO providing shelter, education, healthcare, '
                    'ambulance services, and community welfare in Gilgit-Baltistan, Pakistan since 2017.'
                ),
                'meta_keywords': (
                    'Durrani Welfare Trust, NGO Pakistan, Gilgit-Baltistan, orphanage, '
                    'ambulance, women empowerment, education, welfare'
                ),
            }
        )
        self.stdout.write(self.style.SUCCESS('  Site settings updated'))

    # ------------------------------------------------------------------
    def _seed_about_sections(self):
        sections = [
            {
                'section': 'about',
                'title': 'About Durrani Welfare Trust',
                'content': (
                    'Durrani Welfare Trust is a registered NGO founded in 2017 in Konodas, '
                    'Gilgit-Baltistan, Pakistan. The seeds of the Trust were sown by Mr. Waheed '
                    'Faraz Durrani, who lost his own parents at the tender age of four months. '
                    'From his childhood struggles emerged a lifelong dream: to ensure that no child '
                    'grows up without shelter, care, and affection.\n\n'
                    'After his passing, his daughter Aman Faraz Durrani — then only 19 years old — '
                    'took the responsibility of carrying his legacy forward. Today, the Trust runs '
                    'an orphanage for over 50 girls, a newborn care and adoption programme, free '
                    'ambulance services, women empowerment programmes, clean water infrastructure '
                    'projects, and extensive food and relief distribution across Gilgit-Baltistan.'
                ),
            },
            {
                'section': 'mission',
                'title': 'Our Mission',
                'content': (
                    'To protect and nurture the most vulnerable — orphaned children, newborns, '
                    'widows, and underprivileged families — by providing them with shelter, quality '
                    'education, healthcare, ambulance services, and skill development opportunities. '
                    'We strive to reduce the financial burden on needy families and promote humanity, '
                    'dignity, and community welfare through collective support and compassion.'
                ),
            },
            {
                'section': 'vision',
                'title': 'Our Vision',
                'content': (
                    'A Pakistan where every child grows up with love, security, and the opportunity '
                    'to build a bright future — regardless of whether they have parents or not. '
                    'We envision a society built on inclusiveness, responsibility, respect, and '
                    'collaboration, where no one is left behind.'
                ),
            },
            {
                'section': 'values',
                'title': 'Our Core Values',
                'content': (
                    'Inclusive: We believe in creating a safe and nurturing environment built on '
                    'inclusiveness for every child and family we serve.\n\n'
                    'Responsible: Our team takes responsibility for guiding children toward a '
                    'brighter future, instilling in them confidence and life skills.\n\n'
                    'Respectful: We build our environment on respect, dignity, and compassion for '
                    'every individual regardless of their background.\n\n'
                    'Collaborative: By working hand in hand with our staff, volunteers, and '
                    'community partners, we foster a spirit of collaboration that helps us provide '
                    'the best care, education, and opportunities for our children.'
                ),
            },
            {
                'section': 'history',
                'title': 'Our History',
                'content': (
                    'The seeds of Durrani Welfare Trust were sown in pain but nurtured with love.\n\n'
                    'Mr. Waheed Faraz Durrani lost his parents at the tender age of four months. '
                    'From his childhood struggles emerged a lifelong dream: to ensure that no child '
                    'grows up without shelter, care, and affection.\n\n'
                    'In 2017, his vision became reality when Durrani Welfare Trust was founded in '
                    'Konodas, Gilgit-Baltistan. Together with his daughter Aman, he laid the '
                    'foundation of an organisation built on compassion and service.\n\n'
                    'After his passing, Aman Faraz Durrani — then only 19 years old — took the '
                    'responsibility of carrying his legacy forward. Under her leadership, the Trust '
                    'has grown to serve thousands of families across Gilgit-Baltistan, earning '
                    'national and international recognition including the Pride of Pakistan Award '
                    'by ISPR in 2025 and the International EVE Vision Award 2026.'
                ),
            },
        ]
        for data in sections:
            _, created = AboutSection.objects.update_or_create(
                section=data['section'],
                defaults={'title': data['title'], 'content': data['content'], 'is_active': True}
            )
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} about section: {data["section"]}')

    # ------------------------------------------------------------------
    def _seed_services(self):
        services = [
            {
                'title': 'Orphanage for Girls',
                'slug': 'orphanage-for-girls',
                'short_description': (
                    'A safe home for over 50 orphan girls, providing shelter, education, '
                    'healthcare, and the warmth of family.'
                ),
                'full_description': (
                    'Durrani Welfare Trust operates a dedicated orphanage for girls in '
                    'Gilgit-Baltistan. We provide a safe, loving home for over 50 orphan girls '
                    'who receive not only shelter but also quality education, regular healthcare, '
                    'nutritious food, clothing, and a family environment built on love and care. '
                    'Every child is given the opportunity to grow into a confident, independent '
                    'individual prepared for a bright future.'
                ),
                'icon': 'home',
                'order': 1,
                'is_featured': True,
            },
            {
                'title': 'Infant Care & Adoption',
                'slug': 'infant-care-adoption',
                'short_description': (
                    'Compassionate care for abandoned newborns and a legal court-registered '
                    'adoption programme for deserving families.'
                ),
                'full_description': (
                    'Durrani Welfare Trust is committed to protecting and nurturing the most '
                    'vulnerable — newborns who arrive without family or support. Through our '
                    'newborn care and adoption initiative, we provide a safe, loving environment '
                    'for abandoned infants and guide them toward a hopeful future with caring, '
                    'eligible families. Each adoption is handled with compassion and integrity, '
                    'ensuring proper legal procedures and court registrations are followed so that '
                    'every child can grow up with the love, security, and opportunities they deserve. '
                    'Our goal is not just to place babies in homes, but to create lasting bonds and '
                    'brighter beginnings for every child we serve.'
                ),
                'icon': 'baby',
                'order': 2,
                'is_featured': True,
            },
            {
                'title': 'Education Programmes',
                'slug': 'education-programmes',
                'short_description': (
                    'Holistic early education — Toddler Programme, Pre-School, and primary '
                    'schooling with passionate teachers in a nurturing environment.'
                ),
                'full_description': (
                    'Our education programmes follow a holistic approach that nurtures the whole '
                    'child — mind, body, and heart. We run:\n\n'
                    'Toddler Programme (ages 1–3): A safe, caring, and stimulating environment '
                    'where toddlers grow socially, emotionally, and cognitively through '
                    'age-appropriate activities and guided play.\n\n'
                    'Pre-School Programme: Designed to support early childhood development through '
                    'structured learning and creative exploration. Children develop communication, '
                    'social interaction, independence, and early literacy and numeracy skills.\n\n'
                    'Primary & Secondary Schooling: Through Madrasa Fatima lil Banat and our '
                    'partner schools, children receive quality education alongside Islamic values.\n\n'
                    'Our passionate teachers are dedicated and committed to nurturing each child\'s '
                    'unique potential through creative, play-based teaching methods.'
                ),
                'icon': 'graduation-cap',
                'order': 3,
                'is_featured': True,
            },
            {
                'title': 'Free Ambulance Services',
                'slug': 'ambulance-services',
                'short_description': (
                    '24/7 free emergency ambulance for patients who cannot afford it. '
                    'Call: 03129700108. Over 5,000 served at no cost.'
                ),
                'full_description': (
                    'The ambulance service of Durrani Welfare Trust is a humanitarian initiative '
                    'providing free emergency transport and medical support for needy and '
                    'underprivileged people in Gilgit-Baltistan and nearby communities.\n\n'
                    'The service helps patients reach hospitals quickly during emergencies and '
                    'supports families who cannot afford private ambulance charges.\n\n'
                    'To date our fleet has transported approximately 4,000 deceased individuals '
                    'and 1,000 injured patients — all at no cost.\n\n'
                    'Main goals:\n'
                    '• Emergency patient transportation\n'
                    '• Helping poor and deserving families\n'
                    '• 24/7 community welfare support\n'
                    '• Medical assistance during disasters and crises\n'
                    '• Serving orphanage children and local communities\n\n'
                    'Ambulance Contact: 03129700108'
                ),
                'icon': 'ambulance',
                'order': 4,
                'is_featured': True,
            },
            {
                'title': 'Women Empowerment — Rawasia Waheed HUB',
                'slug': 'women-empowerment',
                'short_description': (
                    'Skills training in sewing and embroidery enabling women to start '
                    'home-based businesses and achieve self-reliance.'
                ),
                'full_description': (
                    'The Rawasia Waheed HUB is a project of Durrani Welfare Trust dedicated to '
                    'empowering women through skills. We provide:\n\n'
                    '• Shelter, financial support, and legal aid for widows and destitute women\n'
                    '• Vocational training in sewing, embroidery (Silai, Kadhai), and handicrafts\n'
                    '• Safe Families Programme — training on child rights, family safety, and '
                    'community welfare (UNICEF accredited)\n'
                    '• Motivational seminars and awareness sessions\n\n'
                    'Through this programme, women gain the confidence and capability to start '
                    'their own home-based businesses, support their families, and become '
                    'financially independent.'
                ),
                'icon': 'users',
                'order': 5,
                'is_featured': True,
            },
            {
                'title': 'Clean Water & Infrastructure',
                'slug': 'clean-water-infrastructure',
                'short_description': (
                    'Construction of water wells and infrastructure in remote '
                    'Gilgit-Baltistan communities. 5 wells built so far.'
                ),
                'full_description': (
                    'Durrani Welfare Trust has constructed 5 clean water wells in remote '
                    'Gilgit-Baltistan communities, providing clean drinking water to thousands '
                    'of families who previously had no access.\n\n'
                    'These wells are built as Sadqa Jaria (ongoing charity) in memory of '
                    'Mr. Waheed Faraz Durrani. The Trust continues to work on infrastructure '
                    'projects that improve the lives of the most isolated communities in '
                    'Gilgit-Baltistan.'
                ),
                'icon': 'droplets',
                'order': 6,
                'is_featured': False,
            },
            {
                'title': 'Food Distribution & Ramadan Programme',
                'slug': 'food-distribution',
                'short_description': (
                    'Ramadan rations to 3,000+ families since 2017. '
                    'Eid clothing for 1,000+ children. Flood emergency relief.'
                ),
                'full_description': (
                    'Since 2017, Durrani Welfare Trust has:\n\n'
                    '• Distributed Ramadan ration packages to over 3,000 families\n'
                    '• Provided Eid clothing to over 1,000 children in remote areas\n'
                    '• Organised annual Qurbani drives distributing fresh meat to orphans, '
                    'widows, and needy families during Eid-ul-Adha\n'
                    '• Provided flood and emergency support to over 100 families with tents, '
                    'clothes, and bedding during natural disasters\n\n'
                    'These programmes ensure that celebrations and basic necessities reach '
                    'every family — no matter how remote their location.'
                ),
                'icon': 'heart',
                'order': 7,
                'is_featured': False,
            },
            {
                'title': 'Marriage Support for Orphan Girls',
                'slug': 'marriage-support',
                'short_description': (
                    'Supporting orphan girls with wedding expenses, Jahez (household items), '
                    'and clothing for a dignified new beginning.'
                ),
                'full_description': (
                    'Durrani Welfare Trust supports the marriages of deserving and orphan girls '
                    'by helping them start a dignified new life. The Trust provides:\n\n'
                    '• Wedding ceremony expenses\n'
                    '• Essential household items (Jahez) — appliances, utensils, bedding\n'
                    '• Clothing and accessories\n'
                    '• Emotional support and guidance\n\n'
                    'Through this initiative, many underprivileged girls receive support, care, '
                    'and hope for a better future. The mission is to reduce the financial burden '
                    'on needy families and promote humanity, dignity, and community welfare.'
                ),
                'icon': 'gift',
                'order': 8,
                'is_featured': False,
            },
            {
                'title': 'Plantation Drive',
                'slug': 'plantation-drive',
                'short_description': (
                    'Community tree plantation drives in Gilgit-Baltistan promoting '
                    'environmental conservation and green awareness.'
                ),
                'full_description': (
                    'Durrani Welfare Trust regularly organises plantation drives in '
                    'Gilgit-Baltistan, engaging staff, students, and community volunteers in '
                    'planting trees across the region.\n\n'
                    'These drives promote environmental awareness, engage youth in community '
                    'service, and contribute to the preservation of Gilgit-Baltistan\'s natural '
                    'beauty for future generations.'
                ),
                'icon': 'tree',
                'order': 9,
                'is_featured': False,
            },
            {
                'title': 'Seminars & Youth Empowerment',
                'slug': 'seminars-youth-empowerment',
                'short_description': (
                    'Motivational lectures and seminars for youth and society to encourage '
                    'welfare contributions and civic engagement.'
                ),
                'full_description': (
                    'Durrani Welfare Trust organises seminars and motivational lectures for '
                    'youth and the wider community to encourage welfare contributions and '
                    'civic engagement.\n\n'
                    'CEO Aman Faraz Durrani is a distinguished speaker who has presented at:\n'
                    '• "Women Shaping the Future" — International Women\'s Day, March 8, 2026 '
                    '(Vision of Women)\n'
                    '• "Youth-Led Civic Empowerment" — January 26, 2026 (Future Path)\n'
                    '• National Security Workshop, Gilgit-Baltistan — November 2025\n\n'
                    'The Trust is also certified in Safe Children and Safe Families training, '
                    'accredited by UNICEF and the Social Welfare Department.'
                ),
                'icon': 'mic',
                'order': 10,
                'is_featured': False,
            },
        ]
        for data in services:
            _, created = Service.objects.update_or_create(
                slug=data['slug'],
                defaults={
                    'title': data['title'],
                    'short_description': data['short_description'],
                    'full_description': data['full_description'],
                    'icon': data['icon'],
                    'order': data['order'],
                    'is_featured': data['is_featured'],
                    'is_active': True,
                }
            )
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} service: {data["title"]}')

    # ------------------------------------------------------------------
    def _seed_news(self):
        news_items = [
            {
                'title': 'Aman Faraz Durrani Honoured with Pride of Pakistan Award by ISPR',
                'slug': 'pride-of-pakistan-award-ispr-2025',
                'category': 'news',
                'summary': (
                    'CEO Aman Faraz Durrani received the Pride of Pakistan Award by ISPR during '
                    'the 78th Independence Day celebrations for outstanding humanitarian work '
                    'and community service.'
                ),
                'content': (
                    'During the 78th Independence Day celebrations titled "Marka-e-Haq", '
                    'Aman Faraz Durrani — founder and CEO of Durrani Welfare Trust, '
                    'Gilgit-Baltistan — was honoured with the prestigious Pride of Pakistan '
                    'Award by the Inter Services Public Relations (ISPR).\n\n'
                    'This award recognises her outstanding humanitarian work and community '
                    'service, particularly her efforts in providing shelter, education, and '
                    'healthcare to orphaned children and underprivileged families across '
                    'Gilgit-Baltistan.\n\n'
                    'Aman Faraz Durrani, who took over the Trust at age 19 after her father '
                    'Mr. Waheed Faraz Durrani\'s passing, has grown the organisation into a '
                    'nationally recognised welfare institution serving thousands of families.'
                ),
                'author': 'DWT Team',
                'is_featured': True,
            },
            {
                'title': 'International EVE Vision Award 2026 — DWT CEO Recognised Globally',
                'slug': 'eve-vision-award-2026',
                'category': 'news',
                'summary': (
                    'Aman Faraz Durrani has been awarded the International EVE Vision Award 2026 '
                    'by Vision of Women & Sahiba Writing Squad, recognising inspiring women '
                    'across the globe for outstanding achievement.'
                ),
                'content': (
                    'Durrani Welfare Trust CEO Aman Faraz Durrani has been awarded the '
                    'International EVE Vision Award 2026, presented by Vision of Women & '
                    'Sahiba Writing Squad. This award recognises inspiring women across the '
                    'globe for outstanding achievement.\n\n'
                    'Aman was also a distinguished speaker at the "Women Shaping the Future" '
                    'grand session on International Women\'s Day, 8th March 2026.\n\n'
                    'The Trust continues to grow under her visionary leadership, serving '
                    'thousands of families across Gilgit-Baltistan and earning recognition '
                    'from organisations including ISPR, UNICEF, and international women\'s '
                    'empowerment platforms.'
                ),
                'author': 'DWT Team',
                'is_featured': True,
            },
            {
                'title': 'Qurbani Drive — Fresh Meat Distributed to Hundreds of Needy Families',
                'slug': 'qurbani-drive-eid-ul-adha',
                'category': 'campaign',
                'summary': (
                    'This Eid-ul-Adha, Durrani Welfare Trust organised its annual Qurbani Drive, '
                    'distributing fresh sacrificial meat to needy families, orphans, and widows '
                    'across Gilgit-Baltistan.'
                ),
                'content': (
                    'Durrani Welfare Trust successfully completed its annual Qurbani Drive this '
                    'Eid-ul-Adha. The initiative involved the collection of Qurbani donations '
                    'and animal sacrifices, followed by the distribution of fresh meat to needy '
                    'families, orphans, widows, and remote communities across Gilgit-Baltistan.\n\n'
                    'Key highlights:\n'
                    '• Collection of Qurbani donations and animal sacrifices\n'
                    '• Distribution of fresh meat to needy families the same day\n'
                    '• Support for orphanage children and underprivileged communities\n'
                    '• Ensuring Eid happiness reaches everyone\n\n'
                    'To donate for the next Qurbani Drive, contact: 03129700108.'
                ),
                'author': 'DWT Team',
                'is_featured': False,
            },
            {
                'title': 'Ramadan Programme — 3,000+ Families Served with Ration Packages Since 2017',
                'slug': 'ramadan-ration-distribution',
                'category': 'campaign',
                'summary': (
                    'Since 2017 Durrani Welfare Trust has distributed Ramadan ration packages '
                    'to over 3,000 families across Gilgit-Baltistan. Eid clothing has been '
                    'provided to over 1,000 children in remote areas.'
                ),
                'content': (
                    'Durrani Welfare Trust carries out its annual Ramadan food distribution '
                    'programme every year, delivering ration packages to deserving families '
                    'across Gilgit-Baltistan.\n\n'
                    'Since the Trust\'s founding in 2017, over 3,000 families have received '
                    'Ramadan rations through this initiative. The packages include essential '
                    'food items to help families observe the holy month with dignity.\n\n'
                    'Every Eid, the Trust also provides clothing to over 1,000 children in '
                    'remote areas.\n\n'
                    'To contribute to our Ramadan programme, contact: 03129700108.'
                ),
                'author': 'DWT Team',
                'is_featured': False,
            },
            {
                'title': 'New Beginning — Durrani Welfare Trust Supports Orphan Girls\' Marriages',
                'slug': 'new-beginning-marriage-support',
                'category': 'story',
                'summary': (
                    'Durrani Welfare Trust supports the marriages of orphan and deserving girls '
                    'by providing wedding expenses, Jahez (household items), and clothing — '
                    'giving them a dignified new beginning.'
                ),
                'content': (
                    '"New Beginning — Daughter of Durrani Welfare Trust."\n\n'
                    'Durrani Welfare Trust supports the marriages of deserving and orphan girls '
                    'by helping them start a dignified new life. The Trust provides wedding '
                    'expenses, essential household items (Jahez), clothes, and other basic needs '
                    'for marriage ceremonies.\n\n'
                    'Through this initiative, many underprivileged girls receive support, care, '
                    'and hope for a better future. The mission of the Trust is to reduce the '
                    'financial burden on needy families and promote humanity, dignity, and '
                    'community welfare through collective support and compassion.'
                ),
                'author': 'DWT Team',
                'is_featured': False,
            },
        ]
        for data in news_items:
            _, created = NewsPost.objects.update_or_create(
                slug=data['slug'],
                defaults={
                    'title': data['title'],
                    'category': data['category'],
                    'summary': data['summary'],
                    'content': data['content'],
                    'author': data['author'],
                    'is_featured': data['is_featured'],
                    'is_published': True,
                }
            )
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} news: {data["title"][:55]}...')

    # ------------------------------------------------------------------
    def _seed_campaigns(self):
        campaigns = [
            {
                'title': 'Sponsor an Orphan Girl',
                'slug': 'sponsor-an-orphan-girl',
                'description': (
                    'Give an orphan girl the gift of education, healthcare, and love. '
                    'Your monthly sponsorship covers her food, clothing, schooling, medical '
                    'care, and daily needs. For just PKR 5,000/month you can change a '
                    'child\'s life forever.'
                ),
                'target_amount': '5000000.00',
                'raised_amount': '1250000.00',
                'is_featured': True,
            },
            {
                'title': 'Build a Water Well — Sadqa Jaria',
                'slug': 'build-water-well-sadqa-jaria',
                'description': (
                    'Help us construct a clean water well for a remote community in '
                    'Gilgit-Baltistan. A single well provides clean water to an entire '
                    'village and serves as ongoing Sadqa Jaria on your behalf. We have '
                    'already built 5 wells — help us build more.'
                ),
                'target_amount': '300000.00',
                'raised_amount': '120000.00',
                'is_featured': True,
            },
            {
                'title': 'Ambulance Fund — Keep the Service Running',
                'slug': 'ambulance-fund',
                'description': (
                    'Our ambulances have transported over 4,000 deceased and 1,000 injured '
                    'patients — all for free. Help us maintain and expand our fleet so we can '
                    'continue this life-saving service 24/7. Contact: 03129700108.'
                ),
                'target_amount': '1500000.00',
                'raised_amount': '450000.00',
                'is_featured': False,
            },
            {
                'title': 'Ramadan Ration Packages 2025',
                'slug': 'ramadan-rations-2025',
                'description': (
                    'Help us distribute Ramadan ration packages to deserving families in '
                    'Gilgit-Baltistan. Since 2017 we have served over 3,000 families. '
                    'PKR 5,000 covers one complete family ration package for the month.'
                ),
                'target_amount': '1500000.00',
                'raised_amount': '600000.00',
                'is_featured': False,
            },
        ]
        for data in campaigns:
            _, created = DonationCampaign.objects.update_or_create(
                slug=data['slug'],
                defaults={
                    'title': data['title'],
                    'description': data['description'],
                    'target_amount': data['target_amount'],
                    'raised_amount': data['raised_amount'],
                    'is_featured': data['is_featured'],
                    'is_active': True,
                }
            )
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} campaign: {data["title"]}')
