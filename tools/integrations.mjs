#!/usr/bin/env node
/**
 * Генератор сторінок інтеграцій: /integrations/ і /integrations/<slug>/.
 *
 *   node tools/integrations.mjs build
 *
 * Шапка, підвал, промо-банер і перемикач теми — ті самі, що в блозі
 * (стилі беруться з /blog/blog.css). Специфічна для цих сторінок верстка
 * лежить інлайново: так її не можна розсинхронізувати з HTML кешем.
 *
 * Факти беруться з бази знань help.ridna.net — не з памʼяті. Якщо змінилась
 * механіка інтеграції, спершу правиться KB, потім цей файл.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://ridna.net';
const OUT = join(ROOT, 'integrations');

const INTEGRATIONS = [
  {
    slug: 'instagram',
    icon: '💬',
    name: 'Instagram',
    h1: 'Instagram Direct і коментарі в CRM',
    title: 'Інтеграція Instagram з Ridna: Direct і коментарі в одному вікні',
    desc: 'Діалоги з Direct і коментарі під дописами приходять у застосунок. Офіційне підключення через Meta — пароль від Instagram вводити не треба.',
    lead: 'Серце Ridna. Повідомлення з Direct, коментарі під дописами, імена й аватарки клієнтів — усе приходить у застосунок, а замовлення створюється прямо з діалогу.',
    plan: 'Старт і Pro',
    planNote: 'Один акаунт на Старті, кілька — на Pro.',
    gives: [
      'Діалоги з Direct і коментарі під дописами в одному списку, з лічильником непрочитаних.',
      'Замовлення створюється прямо з чату: контакт підтягується з переписки, товари — з каталогу.',
      'Бейдж активного замовлення в діалозі — тап веде прямо в нього, з товарами, сумою й статусами.',
      'Контакти збираються самі: пошук за імʼям, ніком Instagram або телефоном.',
      'Кілька акаунтів Instagram без перемикання профілів — на тарифі Pro.',
    ],
    need: 'Акаунт має бути <strong>бізнес</strong> або <strong>автор</strong> (не особистий) і привʼязаний до сторінки Facebook.',
    steps: [
      'Меню → Instagram → «Підключити».',
      'Авторизація через Facebook в офіційному інтерфейсі Meta.',
      'Дозвіл на доступ до повідомлень і коментарів.',
    ],
    after: 'Одразу після підключення підтягуються останні діалоги й дописи з коментарями.',
    notes: [
      '<strong>Пароль від Instagram у застосунок не вводиться.</strong> Підключення відбувається в офіційному інтерфейсі Meta, а доступ дає сама платформа.',
      'Відключити інтеграцію можна будь-коли: нові повідомлення перестануть приходити, а листування в Instagram лишиться на місці.',
    ],
    faq: [
      ['Чи безпечно підключати Instagram до Ridna?', 'Підключення відбувається через офіційний інтерфейс Meta, і пароль від Instagram у застосунок не вводиться — доступ видає сама платформа. Відключити інтеграцію можна будь-коли, листування при цьому лишається в Instagram.'],
      ['Який тип акаунта потрібен?', 'Бізнес-акаунт або акаунт автора, привʼязаний до сторінки Facebook. Особистий акаунт підключити не можна — це обмеження Meta, а не Ridna.'],
      ['Скільки акаунтів Instagram можна підключити?', 'На тарифі Старт — один. На Pro — кілька, і всі чати лежать в одному списку без перемикання між профілями.'],
    ],
    kb: 'https://help.ridna.net/a/instagram',
    blog: [['Чи безпечно підключати Instagram до сторонніх додатків', '/blog/bezpeka-pidklyuchennya-instagram/'], ['Як не пропускати повідомлення в Direct', '/blog/ne-propuskaty-povidomlennya/']],
  },
  {
    slug: 'nova-poshta',
    icon: '🚚',
    name: 'Нова Пошта',
    h1: 'ТТН Нової Пошти прямо із замовлення',
    title: 'Інтеграція Нової Пошти з Ridna: ТТН і авто-статуси доставки',
    desc: 'Накладна створюється з картки замовлення, номер летить клієнту в чат, а статус замовлення оновлюється слідом за статусом посилки.',
    lead: 'Накладна створюється з картки замовлення: дані отримувача підставляються з контакту, номер надсилається клієнтці в чат одним дотиком, а далі статус доставки видно поруч зі статусом оплати.',
    plan: 'Старт і Pro',
    planNote: 'Один акаунт Нової Пошти на Старті, кілька — на Pro.',
    gives: [
      'ТТН із картки замовлення — без переписування даних із чату.',
      'Номер накладної йде клієнтці в чат за готовим шаблоном повідомлення.',
      '<strong>Авто-створення ТТН</strong>: накладна створюється сама, коли замовлення переходить у потрібний статус.',
      '<strong>Авто-статуси замовлення</strong>: статус оновлюється слідом за посилкою — виїхала, прибула, отримана.',
      'Платник за доставку задається разово прямо у формі ТТН — зручно для обміну чи доставки в подарунок.',
      'Наявну ТТН можна привʼязати до замовлення, якщо посилку відправляє постачальник.',
    ],
    need: 'Потрібен ключ API з кабінету Нової Пошти — розділ налаштувань для розробників.',
    steps: [
      'Меню → Нова Пошта → «Додати акаунт».',
      'Скопіювати перший ключ у кабінеті Нової Пошти.',
      'Вставити ключ у Ridna й заповнити дані відправника.',
    ],
    after: 'Далі вмикається автоматизація: шаблон повідомлення, авто-створення ТТН і авто-статуси.',
    notes: [
      '<strong>Налаштування зберігаються на сервері, а не на телефоні.</strong> Якщо магазин веде кілька людей, друга менеджерка не налаштовує все заново — зміни видно на всіх пристроях.',
      '<strong>Опис посилки</strong> задається в налаштуваннях акаунта й підставляється в кожну нову ТТН замість стандартного «Товар». Писати варто коротко — «Одяг», «Дитячий одяг»: надто складні описи Нова Пошта не приймає.',
    ],
    faq: [
      ['Як створити ТТН Нової Пошти з телефона?', 'Накладна створюється з картки замовлення в Ridna: дані отримувача підставляються з контакту, лишається обрати розмір посилки й за потреби суму накладеного платежу. Номер надсилається клієнтці в чат одним дотиком.'],
      ['Чи може ТТН створюватись автоматично?', 'Так. У налаштуваннях інтеграції вмикається авто-створення ТТН — накладна формується сама, коли замовлення переходить у потрібний статус. Окремо вмикаються авто-статуси: статус замовлення оновлюється слідом за статусом посилки.'],
      ['Що потрібно для підключення Нової Пошти?', 'Ключ API з кабінету Нової Пошти — він береться в розділі налаштувань для розробників і вставляється в Ridna разом із даними відправника.'],
    ],
    kb: 'https://help.ridna.net/a/nova-poshta',
    blog: [['Як швидко створити ТТН Нової Пошти з телефону', '/blog/stvoryty-ttn-z-telefonu/'], ['Як відстежити, чи забрала клієнтка посилку', '/blog/vidstezhyty-posylku-novoyi-poshty/']],
  },
  {
    slug: 'monobank',
    icon: '💳',
    name: 'Monobank',
    h1: 'Оплата карткою через monobank',
    title: 'Інтеграція monobank з Ridna: посилання на оплату й автопідтвердження',
    desc: 'Посилання на оплату створюється з картки замовлення, а після оплати замовлення саме позначається оплаченим. Потрібен монобізнес.',
    lead: 'Посилання на оплату створюється прямо з картки замовлення — на всю суму або на частину, якщо берете передоплату. Клієнтка платить карткою, і замовлення саме позначається оплаченим.',
    plan: 'Pro',
    planNote: 'Онлайн-оплати доступні на тарифі Pro і в пробному періоді.',
    gives: [
      'Посилання на оплату з картки замовлення — на всю суму або на частину.',
      'Надсилання посилання клієнтці в чат одним дотиком за готовим шаблоном.',
      '<strong>Автопідтвердження</strong>: щойно клієнтка оплатила, замовлення стає оплаченим без ручної перевірки.',
      'Статус оплати в замовленні показує факт: не оплачено, оплачено частково або оплачено.',
      'Оплата карткою працює і в замовленнях, і на вітрині за посиланням.',
    ],
    need: 'ФОП або ТОВ і доступ до кабінету <strong>монобізнес</strong>. У звичайному особистому акаунті monobank еквайрингу немає.',
    steps: [
      'У кабінеті монобізнес: «Онлайн оплата» → «Додати інструмент» → «Оплати на сайті» → варіант «Власна розробка».',
      'Назвати термінал назвою свого магазину — саме її побачить покупець у вікні оплати.',
      'Заповнити дані бізнесу й скопіювати токен.',
      'Меню → Monobank → вставити токен → «Зберегти».',
    ],
    after: 'Токен одразу перевіряється в банку: якщо він не той, помилка зʼявиться відразу.',
    notes: [
      '<strong>Обирати треба «Власна розробка».</strong> Готові інтеграції з CMS у списку банку призначені для сайтів на WordPress і подібних — Ridna працює через API.',
      '<strong>Токен створюється один раз.</strong> Якщо знадобиться знайти його пізніше, у кабінеті це «Інтеграції» → «На мій сайт».',
    ],
    faq: [
      ['Що потрібно, щоб приймати оплату карткою через monobank?', 'ФОП або ТОВ і доступ до кабінету монобізнес. У звичайному особистому акаунті monobank еквайрингу немає. Далі в кабінеті створюється інструмент «Оплати на сайті» у варіанті «Власна розробка», а його токен вставляється в Ridna.'],
      ['Чи можна взяти часткову передоплату?', 'Так. Посилання на оплату створюється на будь-яку суму — хоч на всю, хоч на частину. Статус замовлення покаже «оплачено частково».'],
      ['Чи потрібно вручну перевіряти, що клієнт оплатив?', 'Ні, якщо ввімкнене автопідтвердження: замовлення позначається оплаченим автоматично, щойно надійшов платіж. Підтвердження приходить від банку, а не зі скріншота в чаті.'],
    ],
    kb: 'https://help.ridna.net/a/monobank',
    blog: [['Як приймати онлайн-оплату в Instagram-магазині', '/blog/pryymaty-oplatu-onlayn/'], ['Шахрайство з оплатами: фейкові скріншоти', '/blog/fejkovyj-skrin-oplaty/']],
  },
  {
    slug: 'liqpay',
    icon: '💳',
    name: 'LiqPay',
    h1: 'Оплата карткою через LiqPay',
    title: 'Інтеграція LiqPay з Ridna: оплата карткою в замовленнях і на сайті',
    desc: 'Публічний і приватний ключі з кабінету LiqPay — і оплата карткою стає доступною в замовленнях та на вітрині за посиланням.',
    lead: 'Другий спосіб приймати оплату карткою. Покупець платить за посиланням, а замовлення саме позначається оплаченим — як і з monobank, на вибір.',
    plan: 'Pro',
    planNote: 'Онлайн-оплати доступні на тарифі Pro і в пробному періоді.',
    gives: [
      'Посилання на оплату з картки замовлення — на всю суму або на частину.',
      '<strong>Автопідтвердження</strong>: замовлення стає оплаченим само, щойно пройшов платіж.',
      'Шаблон повідомлення з посиланням на оплату для швидкого надсилання в чат.',
      'Оплата карткою доступна і в замовленнях, і на вітрині за посиланням.',
    ],
    need: 'Інтеграція доступна користувачам ПриватБанку, які мають рахунок ФОП.',
    steps: [
      'Увійти в кабінет LiqPay — через Приват24 або логін і пароль.',
      'Скопіювати <strong>public</strong> і <strong>private</strong> ключі.',
      'Меню → LiqPay → вставити обидва ключі.',
    ],
    after: 'Далі в «Налаштуваннях автоматизації» вмикається автопідтвердження й шаблон повідомлення.',
    notes: [
      'Monobank і LiqPay — альтернативи одна одній: достатньо підключити будь-яку.',
      'Інтеграцію можна відключити будь-коли — оплата карткою просто стане недоступною.',
    ],
    faq: [
      ['Що потрібно для підключення LiqPay?', 'Рахунок ФОП у ПриватБанку й доступ до кабінету LiqPay. У кабінеті беруться public і private ключі, які вставляються в Ridna.'],
      ['Чим LiqPay відрізняється від monobank у Ridna?', 'Нічим принциповим: обидві інтеграції дають посилання на оплату з картки замовлення й автопідтвердження. Різниця в тому, через який банк ви працюєте — достатньо підключити одну з двох.'],
      ['На якому тарифі доступні онлайн-оплати?', 'На тарифі Pro, а також у пробному періоді, який дає можливості Pro на 30 днів без картки.'],
    ],
    kb: 'https://help.ridna.net/a/liqpay',
    blog: [['Як приймати онлайн-оплату в Instagram-магазині', '/blog/pryymaty-oplatu-onlayn/']],
  },
  {
    slug: 'horoshop',
    icon: '📥',
    name: 'Замовлення з сайту',
    h1: 'Замовлення з Хорошопа — без доступу до API',
    title: 'Інтеграція з Хорошопом: замовлення з сайту в Ridna без API',
    desc: 'API Хорошопа доступне лише з тарифу Pro. Замовлення з сайту можна забирати з листа, який платформа й так надсилає — на будь-якому тарифі.',
    lead: 'Якщо магазин у вас уже є на сторонній платформі, замовлення звідти можуть падати прямо в Ridna. Без доступу до API: ми читаємо лист, який платформа й так шле на пошту адмінам.',
    plan: 'Старт і Pro',
    planNote: 'Працює на будь-якому тарифі Ridna й на будь-якому тарифі вашої платформи.',
    gives: [
      'Замовлення з сайту потрапляють у той самий список, що й створені з Direct.',
      'З листа збираються контакт, адреса доставки, товари й сума.',
      'Адреса будь-якого перевізника — Нова Пошта, Укрпошта чи інший — видно прямо в замовленні.',
      'Окремий бейдж «Хорошоп» відрізняє такі замовлення від тих, що прийшли з вашої вітрини.',
      'Клієнтка з сайту потрапляє в ту саму базу контактів, що й клієнтка з Instagram.',
    ],
    need: 'Доступ до адмінки магазину, щоб додати одержувача поштових сповіщень. Платний доступ до API не потрібен.',
    steps: [
      'Меню → Інтеграції → «Замовлення з сайту» → «Скопіювати адресу».',
      'В адмінці Хорошопа: Налаштування → Адміни → Додати. Додати цю адресу менеджером і поставити галочку «Отримувати Email».',
      'Зробити тестове замовлення на сайті — на екрані інтеграції видно, коли надійшло останнє.',
    ],
    after: 'Далі кожен лист про нове замовлення сам перетворюється на замовлення в застосунку.',
    notes: [
      '<strong>Адреса персональна</strong> — привʼязана до вашого акаунта. Передавати її нікому не варто: чужі замовлення лягатимуть до вас.',
      '<strong>Чужий або підроблений лист не приймається</strong> — замовлення створюється лише з листа самої платформи.',
      '<strong>Перевірено саме на Хорошопі.</strong> Інші платформи форматують листи інакше — надішліть приклад листа, подивимось.',
      'Відгуки й «передзвоніть мені» замовленнями не стають — беруться лише листи, у яких є саме замовлення.',
      'Синхронізація одностороння: залишки й ціни назад на сайт не передаються. Для цього потрібне API платформи.',
    ],
    faq: [
      ['Як підключити Хорошоп до CRM без доступу до API?', 'Через лист про нове замовлення, який платформа й так надсилає адміністраторам. У Ridna ви отримуєте персональну поштову адресу, додаєте її в адмінці магазину як менеджера з галочкою «Отримувати Email» — і з кожного листа збирається замовлення з контактом, адресою доставки, товарами й сумою.'],
      ['Чи потрібен платний тариф платформи?', 'Ні. Доступ до API Хорошопа є лише з тарифу Pro за 2160 ₴ на місяць, тоді як Standard коштує 1020 ₴ — дані зі сторінки тарифів horoshop.ua станом на 13 жовтня 2026 року. Для способу через поштове сповіщення тариф значення не має: лист надсилається й так.'],
      ['Чи синхронізуються залишки з сайтом?', 'Ні. Спосіб через поштове сповіщення односторонній: замовлення з сайту приходять у застосунок, але зміни залишків і цін назад на сайт не передаються.'],
    ],
    kb: 'https://help.ridna.net/a/site-orders',
    blog: [['Магазин на Хорошопі та Instagram: як звести замовлення в одне місце', '/blog/zamovlennya-z-horoshopa/']],
  },
  {
    slug: 'checkbox',
    icon: '🧾',
    name: 'Каса Checkbox',
    h1: 'Фіскальні чеки через касу Checkbox',
    title: 'Інтеграція Checkbox з Ridna: фіскальні чеки з картки замовлення',
    desc: 'Чек виписується однією кнопкою з оплати в замовленні й одразу йде покупцю. Автоматика при повній оплаті або статусі «Виконано».',
    lead: 'Програмний РРО прямо в застосунку: чек виписується однією кнопкою з оплати в замовленні — склад і сума вже там — і одразу надсилається покупцю.',
    plan: 'Pro',
    planNote: 'Доступно на тарифі Pro і в пробному періоді.',
    gives: [
      'Фіскальний чек однією кнопкою з оплати в замовленні.',
      'Чек одразу надсилається покупцю; текст повідомлення редагується.',
      '<strong>Автоматика</strong>: чек створюється сам при повній оплаті або при статусі «Виконано».',
      'Чек повернення при скасуванні — окремим перемикачем.',
      'Зміна каси відкривається сама з першим чеком за день і закривається о 23:30.',
    ],
    need: 'Каса й касир у кабінеті Checkbox, а також <strong>хмарний ключ підпису</strong>.',
    steps: [
      'У кабінеті Checkbox: розділ «Каси» → скопіювати ключ ліцензії каси.',
      'Розділ «Касири» → взяти PIN-код касира.',
      'Меню → блок інтеграцій → «Каса Checkbox» → вставити обидва значення.',
    ],
    after: 'Якщо в касі одна ставка податку, вона підставиться сама; якщо кілька — система попросить обрати.',
    notes: [
      '<strong>Потрібен саме хмарний ключ підпису.</strong> Файловий працює лише поки на компʼютері запущена програма «Checkbox Підпис», а чеки виписуються з сервера — зокрема коли компʼютер вимкнений. Для активної каси хмарний ключ безкоштовний.',
      'Ключ ліцензії й PIN зберігаються в захищеному сховищі: на телефоні їх немає й через застосунок їх не підглянути.',
      'Тестова каса позначається окремо — її чеки в податкову не йдуть.',
      'Часткові оплати й післяплату автоматика не чіпає: рішення лишається за вами.',
    ],
    faq: [
      ['Як виписати фіскальний чек із замовлення?', 'Однією кнопкою з оплати в замовленні: склад і сума вже там, переносити нічого не потрібно, а чек одразу можна надіслати покупцю. Можна ввімкнути автоматику — чек створюватиметься сам при повній оплаті або при статусі «Виконано».'],
      ['Навіщо для Checkbox хмарний ключ підпису?', 'Файловий ключ підписує чеки лише тоді, коли на компʼютері запущена програма «Checkbox Підпис». Чеки з Ridna виписуються з сервера, зокрема коли компʼютер вимкнений, тож потрібен хмарний ключ — для активної каси Checkbox надає його безкоштовно.'],
      ['Що потрібно для підключення каси?', 'Два значення з кабінету Checkbox: ключ ліцензії каси з розділу «Каси» і PIN-код касира з розділу «Касири».'],
    ],
    kb: 'https://help.ridna.net/a/checkbox',
    blog: [['Фіскальні чеки з телефона: як підключити касу Checkbox', '/blog/fiskalni-cheky-z-telefonu/']],
  },
];

/* ---------- спільна верстка ---------- */

function cssVersion() {
  const idx = readFileSync(join(ROOT, 'blog', 'index.html'), 'utf8');
  return idx.match(/blog\.css\?v=([a-f0-9]+)/)?.[1] ?? '';
}

function nav(current) {
  return `<nav class="site-nav">
  <a href="/" class="nav-logo">
    <img src="/logo2.svg" alt="Ridna" class="nav-logo-img" />
    <span class="nav-logo-text">Ridna</span>
  </a>
  <ul class="nav-links">
    <li><a href="/#features">Можливості</a></li>
    <li><a href="/integrations/"${current === 'int' ? ' class="is-current"' : ''}>Інтеграції</a></li>
    <li><a href="/#pricing">Тарифи</a></li>
    <li><a href="/blog/">Блог</a></li>
    <li><a href="https://help.ridna.net" data-umami-event="outbound_kb" data-umami-event-place="nav">База знань</a></li>
    <li class="nav-actions">
      <a href="/pay" class="nav-pill nav-pill-ghost" data-umami-event="login_pay" data-umami-event-place="nav">Вхід</a>
      <a href="https://t.me/ridna_crm" target="_blank" rel="noopener" class="nav-pill" data-umami-event="contact_open" data-umami-event-place="int-nav">Звʼязатись</a>
      <button class="theme-toggle" aria-label="Перемкнути тему" type="button"><svg class="t-light" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg><svg class="t-dark" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
    </li>
  </ul>
</nav>`;
}

function promo(tag) {
  return `<div class="promo">
        <div class="promo-badges"><span class="promo-badge">Без картки</span><span class="promo-badge">5 хв на налаштування</span></div>
        <h3>Ridna — CRM для <span class="accent">Instagram-магазинів</span></h3>
        <p>Завантаж Ridna і спробуй 30 днів безкоштовно — без картки.</p>
        <div class="promo-stores">
          <a class="store-btn" href="https://apps.apple.com/ua/app/ridna-crm/id6782263520?l=uk&amp;pt=129059770&amp;ct=${tag}&amp;mt=8" target="_blank" rel="noopener" data-umami-event="store_ios" data-umami-event-place="int-banner">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            <span class="store-btn-text"><small>Завантажити в</small><strong>App Store</strong></span>
          </a>
          <a class="store-btn" href="https://play.google.com/store/apps/details?id=net.ridna.app&amp;referrer=utm_source%3Dsite%26utm_medium%3Dintegrations%26utm_content%3D${tag}" target="_blank" rel="noopener" data-umami-event="store_android" data-umami-event-place="int-banner">
            <svg viewBox="0 0 512 512" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
            <span class="store-btn-text"><small>Завантажити в</small><strong>Google Play</strong></span>
          </a>
        </div>
      </div>`;
}

const INT_CSS = `
    .int-hero{padding:18px 0 4px}
    .int-hero h1{margin:0 0 14px}
    .int-lead{font-size:18px;line-height:1.6;color:var(--muted);margin:0 0 18px;max-width:62ch}
    .int-plan{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:100px;border:1px solid var(--border);background:var(--surface);font-size:13px;font-weight:600}
    .int-plan b{color:var(--purple)}
    .int-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:14px;margin:26px 0 8px}
    .int-card{display:block;padding:20px;border:1px solid var(--border);border-radius:16px;background:var(--surface);text-decoration:none;color:inherit;transition:border-color .2s,transform .2s}
    .int-card:hover{border-color:var(--purple);transform:translateY(-2px)}
    .int-card-ic{font-size:26px;line-height:1;margin-bottom:10px}
    .int-card h2,.int-card h3{margin:0 0 6px;font-size:17px}
    .int-card p{margin:0 0 10px;font-size:14px;line-height:1.5;color:var(--muted)}
    .int-tag{display:inline-block;font-size:12px;font-weight:600;color:var(--muted);border:1px solid var(--border);border-radius:100px;padding:3px 10px}
    .int-sec{margin:30px 0 0}
    .int-sec h2{font-size:21px;margin:0 0 12px}
    .int-need{border-left:3px solid var(--purple);padding:12px 0 12px 16px;margin:18px 0;font-size:15px;line-height:1.6}
    .int-steps{counter-reset:s;list-style:none;padding:0;margin:0}
    .int-steps li{counter-increment:s;position:relative;padding:0 0 12px 38px;line-height:1.6}
    .int-steps li::before{content:counter(s);position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:var(--purple);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center}
    .int-notes li{margin-bottom:10px;line-height:1.6}
    .int-more{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
    .int-more a{font-size:14px;padding:8px 14px;border:1px solid var(--border);border-radius:100px;text-decoration:none;color:inherit}
    .int-more a:hover{border-color:var(--purple)}
    @media(max-width:600px){.int-lead{font-size:16px}}`;

function head({ title, desc, canonical, ld }) {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/og-image.png" />
  <meta property="og:locale" content="uk_UA" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/blog/blog.css?v=${cssVersion()}" />
  <style>${INT_CSS}
  </style>

${ld.map((o) => '  <script type="application/ld+json">\n  ' + JSON.stringify(o, null, 2).replace(/\n/g, '\n  ') + '\n  </script>').join('\n\n')}

  <script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();</script>
  <script defer src="https://cloud.umami.is/script.js" data-website-id="79ee62ea-0553-465a-bc94-cfca1065474e"></script>
</head>
<body>`;
}

function tail() {
  return `
      <footer class="blog-footer">
        <span>© 2026 Ridna · Зроблено в Україні</span>
        <span><a href="/integrations/">Усі інтеграції</a> · <a href="/blog/">Блог</a> · <a href="https://help.ridna.net" data-umami-event="outbound_kb" data-umami-event-place="int-footer">База знань</a></span>
      </footer>
    </div>
  </div>
</div>

<a href="https://t.me/ridna_crm" target="_blank" rel="noopener" class="tg-fab" aria-label="Написати в Telegram" data-umami-event="contact_open" data-umami-event-place="int-fab">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.8 19c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.4 13.1 1.6 11.6c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.1 1.5z"/></svg>
</a>

<script>
(function(){function t(){var r=document.documentElement;var n=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',n);try{localStorage.setItem('theme',n);}catch(e){}}document.querySelectorAll('.theme-toggle').forEach(function(b){b.addEventListener('click',t);});})();
</script>
</body>
</html>
`;
}

/* ---------- сторінки ---------- */

function crumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1] })),
  };
}

function buildHub() {
  const canonical = `${SITE}/integrations/`;
  const title = 'Інтеграції Ridna: Instagram, Нова Пошта, оплати, каса та сайт';
  const desc = 'Усе, що підключається до Ridna: Instagram Direct, Нова Пошта, monobank і LiqPay, каса Checkbox та замовлення з сайту на сторонній платформі.';

  const ld = [
    crumbLd([['Головна', SITE + '/'], ['Інтеграції', canonical]]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Інтеграції Ridna',
      itemListElement: INTEGRATIONS.map((x, i) => ({
        '@type': 'ListItem', position: i + 1, name: x.name, url: `${SITE}/integrations/${x.slug}/`,
      })),
    },
  ];

  const cards = INTEGRATIONS.map((x) => `      <a class="int-card" href="/integrations/${x.slug}/">
        <div class="int-card-ic">${x.icon}</div>
        <h2>${x.name}</h2>
        <p>${x.desc}</p>
        <span class="int-tag">${x.plan}</span>
      </a>`).join('\n');

  const html = head({ title, desc, canonical, ld }) + `
${nav('int')}

<div class="wrap">
  <div class="crumb-row">
    <nav class="crumbs" aria-label="Хлібні крихти">
      <a href="/">Головна</a> <span>/</span> <span aria-current="page">Інтеграції</span>
    </nav>
  </div>

  <div class="art-layout">
    <div class="art-main">
      <article class="post-body">
        <div class="int-hero">
          <h1>Інтеграції Ridna</h1>
          <p class="int-lead">Ridna звʼязує те, між чим ви зазвичай перемикаєтесь: месенджер, доставку, банк, касу й сайт. Нижче — усе, що підключається, і що кожна інтеграція дає на практиці.</p>
        </div>

        <div class="int-grid">
${cards}
        </div>

        <div class="int-sec">
          <h2>Скільки це коштує</h2>
          <p>Усі інтеграції входять у тариф — окремої плати за підключення немає. На тарифі <strong>Старт за 499 ₴</strong> працюють Instagram, Нова Пошта й замовлення з сайту. Онлайн-оплати та каса Checkbox доступні на <strong>Pro за 799 ₴</strong>, а також у пробному періоді: перші 30 днів дають можливості Pro без картки.</p>
        </div>

        <div class="int-sec">
          <h2>Чого не треба</h2>
          <ul class="int-notes">
            <li>Програмістів і налаштування через підрядника: кожна інтеграція підключається з телефона за кілька хвилин.</li>
            <li>Пароля від Instagram — підключення відбувається в офіційному інтерфейсі Meta.</li>
            <li>Платного доступу до API вашої платформи, щоб забирати замовлення з сайту.</li>
          </ul>
        </div>
      </article>

      ${promo('int-hub')}
` + tail();

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'index.html'), html);
}

function buildPage(x) {
  const canonical = `${SITE}/integrations/${x.slug}/`;
  const ld = [
    crumbLd([['Головна', SITE + '/'], ['Інтеграції', SITE + '/integrations/'], [x.name, canonical]]),
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'uk-UA',
      mainEntity: x.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  const others = INTEGRATIONS.filter((o) => o.slug !== x.slug)
    .map((o) => `<a href="/integrations/${o.slug}/">${o.icon} ${o.name}</a>`).join('\n        ');

  const html = head({ title: x.title, desc: x.desc, canonical, ld }) + `
${nav('int')}

<div class="wrap">
  <div class="crumb-row">
    <nav class="crumbs" aria-label="Хлібні крихти">
      <a href="/">Головна</a> <span>/</span> <a href="/integrations/">Інтеграції</a> <span>/</span> <span aria-current="page">${x.name}</span>
    </nav>
  </div>

  <div class="art-layout">
    <div class="art-main">
      <article class="post-body">
        <div class="int-hero">
          <h1>${x.h1}</h1>
          <p class="int-lead">${x.lead}</p>
          <span class="int-plan">Тариф: <b>${x.plan}</b></span>
        </div>

        <div class="int-sec">
          <h2>Що це дає</h2>
          <ul>
${x.gives.map((g) => `            <li>${g}</li>`).join('\n')}
          </ul>
        </div>

        <div class="int-sec">
          <h2>Як підключити</h2>
          <div class="int-need">${x.need}</div>
          <ol class="int-steps">
${x.steps.map((s) => `            <li>${s}</li>`).join('\n')}
          </ol>
          <p>${x.after}</p>
          <p>Покрокова інструкція зі знімками екрана — у <a href="${x.kb}" data-umami-event="outbound_kb" data-umami-event-place="int-${x.slug}">базі знань</a>.</p>
        </div>

        <div class="int-sec">
          <h2>Що варто знати</h2>
          <ul class="int-notes">
${x.notes.map((n) => `            <li>${n}</li>`).join('\n')}
          </ul>
          <p>${x.planNote}</p>
        </div>

        <section class="faq">
          <h2>Часті питання</h2>
${x.faq.map(([q, a]) => `          <p class="faq-q">${q}</p>\n          <p class="faq-a">${a}</p>`).join('\n')}
        </section>

        ${x.blog.length ? `<div class="int-sec">
          <h2>Докладніше в блозі</h2>
          <ul>
${x.blog.map(([t, u]) => `            <li><a href="${u}">${t}</a></li>`).join('\n')}
          </ul>
        </div>` : ''}

        <div class="int-sec">
          <h2>Інші інтеграції</h2>
          <div class="int-more">
        ${others}
          </div>
        </div>
      </article>

      ${promo('int-' + x.slug)}
` + tail();

  const dir = join(OUT, x.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

function writeSitemap() {
  const file = join(ROOT, 'sitemap.xml');
  const existing = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const kept = [...existing.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]).filter((b) => !/\/integrations\//.test(b));
  const d = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url>\n    <loc>${SITE}/integrations/</loc>\n    <lastmod>${d}</lastmod>\n  </url>`,
    ...INTEGRATIONS.map((x) => `  <url>\n    <loc>${SITE}/integrations/${x.slug}/</loc>\n    <lastmod>${d}</lastmod>\n  </url>`),
  ];
  const norm = kept.map((b) => b.split('\n').map((l) => (l.startsWith(' ') ? l : '  ' + l)).join('\n'));
  writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...norm, ...urls].join('\n')}\n</urlset>\n`);
}

const cmd = process.argv[2];
if (cmd === 'build') {
  buildHub();
  INTEGRATIONS.forEach(buildPage);
  writeSitemap();
  console.log(`✓ зібрано: /integrations/ + ${INTEGRATIONS.length} сторінок`);
  console.log(`  оновлено: sitemap.xml (css v=${cssVersion()})`);
  console.log('  не забудь: node tools/blog.mjs indexnow --all після деплою');
} else {
  console.log('Команди:\n  node tools/integrations.mjs build');
}
