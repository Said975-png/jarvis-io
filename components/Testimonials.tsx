import { useEffect } from 'react'

interface Testimonial {
  name: string
  location: string
  text: string
}

const testimonials: Testimonial[] = [
  {
    name: "Карим",
    location: "Ташкент, Freelance",
    text: "Заказал сайт от Jarvis Intercoma онлайн-магазин с ИИ Джарвисом, и не пожалел! Всё сделали быстро, магазин сразу начал приносить заказы. Особенно понравилось, что бот отвечает клиентам мгновенно, даже ночью."
  },
  {
    name: "Мадина Р.",
    location: "Ташкент, Freelance",
    text: "Мне сделали сайт с Jarvis Intercoma под мою студию украшений. Красиво, удобно, и всё автоматизировано. Теперь я занимаюсь только заказами, а не сижу целый день в переписках с клиентами."
  },
  {
    name: "Умид А.",
    location: "Ташкент, Freelance",
    text: "Я не разбираюсь в сайтах, но в Jarvis всё объяснили простыми словами. Сделал магазин, подключил оплату, и теперь я продаю в 3 странах. Рекомендую!"
  },
  {
    name: "Алимова М.",
    location: "Чебоксары, Freelance",
    text: "Создала сайт с Jarvis Intercoma для своего магазина одежды. Работать стало легче: бот помогает клиентам выбирать стиль, отвечает на вопросы, а я только получаю заказы. Очень довольна!"
  },
  {
    name: "Романова И.",
    location: "Уфа, Freelance",
    text: "Сделала сайт для своего бутика с Jarvis. Удобно и быстро, клиенты довольны. Бот помогает им найти нужные товары, даже ночью."
  },
  {
    name: "Алексеева Л.",
    location: "Казань, Freelance",
    text: "Создала интернет-магазин с помощью Jarvis. Весь процесс автоматизирован, а бот отвечает на вопросы клиентов в любое время дня и ночи."
  },
  {
    name: "Шарипов М.",
    location: "Бухара, Freelance",
    text: "Решил попробовать Jarvis для создания сайта магазина бытовой техники. Результат впечатлил: бот быстро и точно помогает клиентам выбрать товар."
  },
  {
    name: "Васильева О.",
    location: "Набережные Челны, Freelance",
    text: "Мой магазин ювелирных изделий стал более удобным благодаря Jarvis. Бот помогает клиентам выбрать подходящие украшения и отвечает на все вопросы."
  },
  {
    name: "Захарова Т.",
    location: "Самара, Freelance",
    text: "Создала сайт для своего магазина с Jarvis. Клиенты часто обращаются за помощью, и бот всегда подскажет им нужную информацию."
  },
  {
    name: "Розенбаум В.",
    location: "Санкт-Петербург, Freelance",
    text: "Сайт для онлайн-магазина с Jarvis стал отличным решением. Бот быстро помогает покупателям, что существенно увеличило количество заказов."
  },
  {
    name: "Петрова М.",
    location: "Нижний Новгород, Freelance",
    text: "С Jarvis сайт для моего магазина одежды стал суперудобным. Бот помогает клиентам найти нужный товар и оформить заказ без проблем."
  }
]

export default function Testimonials() {
  // Дублируем отзывы для бесконечной прокрутки
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Отзывы наших клиентов</h2>
        <div className="testimonials-slider">
          <div className="testimonials-track">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">★</div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <span className="author-location">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          padding: 80px 0;
          background: linear-gradient(135deg, rgba(25, 28, 31, 0.95) 0%, rgba(35, 40, 45, 0.9) 100%);
          position: relative;
          overflow: hidden;
        }

        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(64, 224, 208, 0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
          z-index: 1;
        }

        .testimonials-container {
          position: relative;
          z-index: 2;
        }

        .testimonials-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #40e0d0;
          margin-bottom: 60px;
          text-shadow: 0 0 20px rgba(64, 224, 208, 0.3);
          padding: 0 20px;
        }

        .testimonials-slider {
          overflow: hidden;
          position: relative;
        }

        .testimonials-track {
          display: flex;
          gap: 30px;
          animation: scroll 60s linear infinite;
          width: fit-content;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .testimonials-track:hover {
          animation-play-state: paused;
        }

        .testimonial-card {
          flex-shrink: 0;
          width: 380px;
          min-height: 280px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(64, 224, 208, 0.3);
          border-radius: 30px;
          padding: 35px;
          backdrop-filter: blur(15px);
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          overflow: hidden;
        }

        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 30px;
          background: linear-gradient(135deg,
            rgba(64, 224, 208, 0.1) 0%,
            rgba(64, 224, 208, 0.05) 30%,
            transparent 60%,
            rgba(64, 224, 208, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .testimonial-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent);
          transform: rotate(45deg) translateX(-100%);
          transition: transform 0.6s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(64, 224, 208, 0.6);
          box-shadow:
            0 20px 40px rgba(64, 224, 208, 0.15),
            0 10px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          background: linear-gradient(145deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.06) 100%);
        }

        .testimonial-card:hover::before {
          opacity: 1;
        }

        .testimonial-card:hover::after {
          transform: rotate(45deg) translateX(100%);
        }

        .testimonial-content {
          position: relative;
          z-index: 3;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .quote-icon {
          font-size: 2.5rem;
          color: rgba(64, 224, 208, 0.7);
          margin-bottom: 20px;
          display: block;
          text-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover .quote-icon {
          color: #40e0d0;
          text-shadow: 0 0 15px rgba(64, 224, 208, 0.5);
          transform: scale(1.1);
        }

        .testimonial-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #e8e8e8;
          margin-bottom: 25px;
          font-style: italic;
          min-height: 120px;
          display: flex;
          align-items: flex-start;
          flex-grow: 1;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          transition: color 0.3s ease;
          text-align: left;
        }

        .testimonial-card:hover .testimonial-text {
          color: #f0f0f0;
        }

        .testimonial-author {
          border-top: 1px solid rgba(64, 224, 208, 0.3);
          padding-top: 18px;
          background: linear-gradient(90deg,
            transparent,
            rgba(64, 224, 208, 0.05),
            transparent);
          border-radius: 15px;
          padding: 18px 15px 0;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover .testimonial-author {
          border-top-color: rgba(64, 224, 208, 0.5);
          background: linear-gradient(90deg,
            transparent,
            rgba(64, 224, 208, 0.1),
            transparent);
        }

        .author-name {
          font-size: 1.15rem;
          font-weight: 600;
          color: #40e0d0;
          margin: 0 0 6px 0;
          text-shadow: 0 0 8px rgba(64, 224, 208, 0.3);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover .author-name {
          color: #4af0e0;
          text-shadow: 0 0 12px rgba(64, 224, 208, 0.5);
        }

        .author-location {
          font-size: 0.95rem;
          color: #aaa;
          transition: color 0.3s ease;
        }

        .testimonial-card:hover .author-location {
          color: #bbb;
        }

        @media (max-width: 768px) {
          .testimonials-title {
            font-size: 2rem;
            margin-bottom: 40px;
          }

          .testimonials-section {
            padding: 60px 0;
          }

          .testimonials-track {
            gap: 20px;
            animation: scroll 40s linear infinite;
          }

          .testimonial-card {
            width: 300px;
            padding: 30px;
            border-radius: 25px;
          }

          .testimonial-card::before,
          .testimonial-card::after {
            border-radius: 25px;
          }

          .testimonial-text {
            font-size: 1rem;
            min-height: 70px;
          }

          .quote-icon {
            font-size: 2.2rem;
            margin-bottom: 18px;
          }
        }

        @media (max-width: 480px) {
          .testimonial-card {
            width: 270px;
            padding: 25px;
            border-radius: 22px;
          }

          .testimonial-card::before,
          .testimonial-card::after {
            border-radius: 22px;
          }

          .testimonials-track {
            gap: 15px;
            animation: scroll 35s linear infinite;
          }

          .testimonial-text {
            font-size: 0.95rem;
            min-height: 60px;
          }

          .quote-icon {
            font-size: 2rem;
            margin-bottom: 15px;
          }

          .author-name {
            font-size: 1.1rem;
          }

          .author-location {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  )
}
