import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Публичная оферта | OGFooDY",
  description: "Публичная оферта на оказание услуг доставки домашней еды OGFooDY",
}

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Button>
        </Link>

        <div className="bg-white border-2 border-black rounded-xl p-8 shadow-brutal">
          <h1 className="text-3xl font-black text-black mb-6">Публичная оферта</h1>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground mb-2">
                1.1. Настоящий документ является публичной офертой (далее — Оферта) Индивидуального предпринимателя Ясашнева Сергея Владимировича (далее — Продавец, «Оуджифуди») о заключении договора на оказание услуг по доставке готовых наборов еды на 2 дня (далее — Услуги) на условиях, изложенных ниже.
              </p>
              <p className="text-muted-foreground mb-2">
                1.2. В соответствии с пунктом 2 статьи 437 Гражданского кодекса Российской Федерации, в случае принятия изложенных ниже условий и оплаты услуг лицо, производящее акцепт этой оферты, становится Заказчиком (далее — Заказчик).
              </p>
              <p className="text-muted-foreground">
                1.3. Акцептом настоящей оферты является оформление заказа на сайте ogfoody.ru и/или оплата услуг.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">2. Реквизиты Продавца</h2>
              <div className="bg-gray-50 border border-black rounded-lg p-4">
                <p className="text-muted-foreground font-medium">
                  Индивидуальный предприниматель Ясашнев Сергей Владимирович
                  <br />
                  ИНН: 780624071235
                  <br />
                  ОГРНИП: 318784700273802
                  <br />
                  Адрес: Лиговский пр., д. 289 А, г. Санкт-Петербург
                  <br />
                  Сайт: ogfoody.ru
                  <br />
                  Телефон: <a href="tel:+79219176619" className="text-[#9D00FF] hover:underline">+7 (921) 917-66-19</a>
                  <br />
                  Email: <a href="mailto:hello@ogfoody.ru" className="text-[#9D00FF] hover:underline">hello@ogfoody.ru</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">3. Предмет договора</h2>
              <p className="text-muted-foreground mb-2">
                3.1. Продавец обязуется оказать Заказчику услуги по доставке готовых наборов еды на 2 дня (далее — Товар), а Заказчик обязуется принять и оплатить Товар на условиях настоящей Оферты.
              </p>
              <p className="text-muted-foreground mb-2">
                3.2. Товар представляет собой готовые блюда, упакованные для хранения в холодильнике и рассчитанные на питание в течение 2 дней.
              </p>
              <p className="text-muted-foreground">
                3.3. Меню обновляется еженедельно и размещается на сайте ogfoody.ru.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">4. Условия заказа</h2>
              <p className="text-muted-foreground mb-2">
                4.1. Минимальная сумма заказа составляет 2300 (две тысячи триста) рублей.
              </p>
              <p className="text-muted-foreground mb-2">
                4.2. Ближайшая доставка возможна завтра (кроме субботы). Суббота является нерабочим днем.
              </p>
              <p className="text-muted-foreground mb-2">
                4.3. Заказы по текущему меню принимаются на любой день до ближайшего понедельника включительно.
              </p>
              <p className="text-muted-foreground">
                4.4. Заказ считается принятым после подтверждения Продавцом и оплаты Заказчиком.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">5. Доставка</h2>
              <p className="text-muted-foreground mb-2">
                5.1. Доставка осуществляется в пределах г. Санкт-Петербурга.
              </p>
              <p className="text-muted-foreground mb-2">
                5.2. Доставка производится вечером накануне дня питания.
              </p>
              <p className="text-muted-foreground mb-2">
                5.3. Стоимость доставки:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Бесплатно — в синей зоне при заказе от 2300 рублей</li>
                <li>+400 рублей — в красной зоне</li>
                <li>По тарифам Яндекс.Доставки — в других районах</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                5.4. Точное время доставки согласовывается с Заказчиком по телефону.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">6. Оплата</h2>
              <p className="text-muted-foreground mb-2">
                6.1. Оплата Товара производится одним из следующих способов:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Наличными курьеру при получении</li>
                <li>Банковской картой на сайте при оформлении заказа</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                6.2. Моментом оплаты считается поступление денежных средств на счет Продавца или передача наличных средств курьеру.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">7. Права и обязанности сторон</h2>
              <p className="text-muted-foreground mb-2">
                7.1. Продавец обязуется:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Изготовить Товар из свежих ингредиентов</li>
                <li>Осуществить доставку Товара в согласованное время</li>
                <li>Обеспечить качество и безопасность Товара</li>
              </ul>
              <p className="text-muted-foreground mt-2 mb-2">
                7.2. Заказчик обязуется:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Предоставить достоверные данные для доставки</li>
                <li>Принять Товар в согласованное время</li>
                <li>Оплатить Товар в установленном порядке</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">8. Отмена и изменение заказа</h2>
              <p className="text-muted-foreground mb-2">
                8.1. Заказчик вправе отменить или изменить заказ до дня доставки.
              </p>
              <p className="text-muted-foreground mb-2">
                8.2. В день доставки отмена или изменение заказа невозможны.
              </p>
              <p className="text-muted-foreground">
                8.3. При отмене оплаченного заказа денежные средства возвращаются на карту Заказчика в течение 3-5 рабочих дней.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">9. Ответственность сторон</h2>
              <p className="text-muted-foreground mb-2">
                9.1. Продавец не несет ответственности за качество Товара в случае нарушения Заказчиком условий хранения.
              </p>
              <p className="text-muted-foreground mb-2">
                9.2. Рекомендуемый срок хранения Товара — 48 часов в холодильнике при температуре от +2°C до +6°C.
              </p>
              <p className="text-muted-foreground">
                9.3. При обнаружении проблем с качеством Товара Заказчик должен связаться с Продавцом в течение 24 часов после доставки.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">10. Заключительные положения</h2>
              <p className="text-muted-foreground mb-2">
                10.1. Настоящая Оферта вступает в силу с момента размещения на сайте ogfoody.ru и действует до момента отзыва Оферты Продавцом.
              </p>
              <p className="text-muted-foreground mb-2">
                10.2. Продавец оставляет за собой право вносить изменения в настоящую Оферту без предварительного уведомления Заказчика.
              </p>
              <p className="text-muted-foreground">
                10.3. Все споры решаются путем переговоров, а при невозможности достижения согласия — в суде по месту нахождения Продавца.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-black mt-8">
              <p className="text-xs text-muted-foreground">
                Дата публикации: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
