import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Политика конфиденциальности | OGFooDY",
  description: "Политика конфиденциальности сервиса доставки домашней еды OGFooDY",
}

export default function PolicyPage() {
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
          <h1 className="text-3xl font-black text-black mb-6">Политика конфиденциальности</h1>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground mb-2">
                1.1. Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты персональных данных пользователей сервиса OGFooDY (далее — Сервис), принадлежащего ИП Ясашнев Сергей Владимирович (далее — Оператор).
              </p>
              <p className="text-muted-foreground mb-2">
                1.2. Использование Сервиса означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональной информации.
              </p>
              <p className="text-muted-foreground">
                1.3. В случае несогласия с условиями Политики Пользователь должен прекратить использование Сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">2. Оператор персональных данных</h2>
              <p className="text-muted-foreground mb-2">
                2.1. Оператором персональных данных является:
              </p>
              <div className="bg-gray-50 border border-black rounded-lg p-4 mb-2">
                <p className="text-muted-foreground font-medium">
                  ИП Ясашнев Сергей Владимирович
                  <br />
                  ИНН: 780624071235
                  <br />
                  ОГРНИП: 318784700273802
                  <br />
                  Адрес: Лиговский пр., д. 289 А, г. Санкт-Петербург
                  <br />
                  Сайт: ogfoody.ru
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">3. Цели обработки персональных данных</h2>
              <p className="text-muted-foreground mb-2">
                3.1. Оператор обрабатывает персональные данные Пользователей в следующих целях:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Оказание услуг по доставке готовой домашней еды</li>
                <li>Обработка и выполнение заказов</li>
                <li>Связь с Пользователем по вопросам заказов</li>
                <li>Информирование о статусе заказов и изменениях в работе Сервиса</li>
                <li>Улучшение качества предоставляемых услуг</li>
                <li>Соблюдение требований законодательства Российской Федерации</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">4. Состав персональных данных</h2>
              <p className="text-muted-foreground mb-2">
                4.1. Оператор обрабатывает следующие персональные данные Пользователей:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Имя</li>
                <li>Номер телефона</li>
                <li>Адрес доставки (район, адрес)</li>
                <li>История заказов</li>
                <li>Данные о платежах (обрабатываются платежными системами)</li>
                <li>Технические данные (IP-адрес, тип устройства, браузер)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">5. Правовые основания обработки</h2>
              <p className="text-muted-foreground mb-2">
                5.1. Обработка персональных данных осуществляется на основании:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
                <li>Согласия Пользователя на обработку персональных данных</li>
                <li>Договора, стороной которого является Пользователь</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">6. Способы и сроки обработки</h2>
              <p className="text-muted-foreground mb-2">
                6.1. Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств.
              </p>
              <p className="text-muted-foreground mb-2">
                6.2. Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, или до момента отзыва согласия Пользователем.
              </p>
              <p className="text-muted-foreground">
                6.3. После достижения целей обработки персональные данные подлежат уничтожению, за исключением случаев, когда их хранение требуется в соответствии с законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">7. Меры по защите персональных данных</h2>
              <p className="text-muted-foreground mb-2">
                7.1. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения, а также от иных неправомерных действий.
              </p>
              <p className="text-muted-foreground">
                7.2. Оператор обеспечивает конфиденциальность персональных данных и не раскрывает их третьим лицам без согласия Пользователя, за исключением случаев, предусмотренных законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">8. Права Пользователя</h2>
              <p className="text-muted-foreground mb-2">
                8.1. Пользователь имеет право:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Получать информацию, касающуюся обработки его персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">9. Контакты</h2>
              <p className="text-muted-foreground mb-2">
                По всем вопросам, связанным с обработкой персональных данных, Вы можете обратиться к Оператору:
              </p>
              <div className="bg-gray-50 border border-black rounded-lg p-4">
                <p className="text-muted-foreground">
                  Телефон: <a href="tel:+79219176619" className="text-[#9D00FF] hover:underline">+7 (921) 917-66-19</a>
                  <br />
                  Email: <a href="mailto:hello@ogfoody.ru" className="text-[#9D00FF] hover:underline">hello@ogfoody.ru</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">10. Заключительные положения</h2>
              <p className="text-muted-foreground mb-2">
                10.1. Оператор оставляет за собой право вносить изменения в настоящую Политику конфиденциальности.
              </p>
              <p className="text-muted-foreground">
                10.2. Новая редакция Политики вступает в силу с момента ее размещения на сайте, если иное не предусмотрено новой редакцией Политики.
              </p>
            </section>

            <div className="pt-6 border-t-2 border-black mt-8">
              <p className="text-xs text-muted-foreground">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
