const testimonials = [
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

export default function TestimonialsSimple() {
  // Дублируем массив для бесконечной прокрутки
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="testimonials-section-chatgpt">
      <div className="testimonials-container-chatgpt">
        <div className="testimonials-header-chatgpt">
          <h2 className="testimonials-title-chatgpt">
            Отзывы наших клиентов
          </h2>
          <p className="testimonials-description-chatgpt">
            Узнайте что говорят наши клиенты о работе с JARVIS
          </p>
        </div>
        
        <div className="testimonials-slider-chatgpt">
          <div className="testimonials-track-chatgpt">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card-chatgpt">
                <div className="testimonial-content-chatgpt">
                  <div className="testimonial-icon-chatgpt">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="testimonial-text-chatgpt">
                    "{testimonial.text}"
                  </p>
                  <div className="testimonial-author-chatgpt">
                    <h4 className="author-name-chatgpt">
                      {testimonial.name}
                    </h4>
                    <span className="author-location-chatgpt">
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .testimonials-section-chatgpt {
          position: relative;
          padding: 100px 0 0 0;
          background: #ffffff;
          overflow: hidden;
          margin: 0;
          border: none;
        }

        .testimonials-section-chatgpt::before {
          content: '';
          position: absolute;
          top: 20%;
          right: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(99, 102, 241, 0.05) 40%,
            transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: float 15s ease-in-out infinite;
        }

        .testimonials-section-chatgpt::after {
          content: '';
          position: absolute;
          bottom: 20%;
          left: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle,
            rgba(6, 182, 212, 0.06) 0%,
            rgba(99, 102, 241, 0.04) 40%,
            transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: float 18s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-20px) rotate(3deg) scale(1.05);
          }
        }

        .testimonials-container-chatgpt {
          position: relative;
          z-index: 2;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 3rem;
          width: 100%;
        }

        .testimonials-header-chatgpt {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .testimonials-title-chatgpt {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-text, #0f172a);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          font-family: var(--font-primary, 'Inter', sans-serif);
        }

        .testimonials-description-chatgpt {
          font-size: 1.25rem;
          color: var(--color-text-light, #475569);
          font-weight: 500;
        }

        .testimonials-slider-chatgpt {
          overflow: hidden;
          position: relative;
          border-radius: 20px;
          padding-bottom: 100px;
        }

        .testimonials-track-chatgpt {
          display: flex;
          gap: 2rem;
          animation: scroll 50s linear infinite;
          width: fit-content;
        }

        .testimonials-track-chatgpt:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .testimonial-card-chatgpt {
          flex-shrink: 0;
          width: 380px;
          min-height: 280px;
          background: linear-gradient(145deg,
            #ffffff 0%,
            #fefefe 100%);
          border: 1px solid var(--color-gray-200, #e2e8f0);
          border-radius: var(--border-radius-lg, 16px);
          padding: 2rem;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 10px 15px -3px rgba(99, 102, 241, 0.08);
        }

        .testimonial-card-chatgpt::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 2px;
          background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.4) 0%,
            rgba(6, 182, 212, 0.4) 25%,
            rgba(139, 92, 246, 0.4) 50%,
            rgba(6, 182, 212, 0.4) 75%,
            rgba(99, 102, 241, 0.4) 100%);
          border-radius: var(--border-radius-lg, 16px);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .testimonial-card-chatgpt:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--color-primary, #6366f1);
          box-shadow:
            0 10px 25px -5px rgba(0, 0, 0, 0.15),
            0 4px 6px -2px rgba(0, 0, 0, 0.1),
            0 20px 40px -8px rgba(99, 102, 241, 0.25);
        }

        .testimonial-card-chatgpt:hover::before {
          opacity: 1;
        }

        .testimonial-content-chatgpt {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .testimonial-icon-chatgpt {
          color: var(--color-primary, #6366f1);
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .testimonial-card-chatgpt:hover .testimonial-icon-chatgpt {
          opacity: 1;
          transform: scale(1.1);
        }

        .testimonial-text-chatgpt {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-text-light, #475569);
          margin-bottom: 1.5rem;
          font-style: italic;
          flex-grow: 1;
          display: flex;
          align-items: center;
          text-align: left;
          font-family: var(--font-primary, 'Inter', sans-serif);
        }

        .testimonial-author-chatgpt {
          padding-top: 1rem;
          margin-top: auto;
        }

        .author-name-chatgpt {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-primary, #6366f1);
          margin: 0 0 0.5rem 0;
          font-family: var(--font-primary, 'Inter', sans-serif);
        }

        .author-location-chatgpt {
          font-size: 0.875rem;
          color: var(--color-text-muted, #94a3b8);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .testimonials-container-chatgpt {
            padding: 0 1.5rem;
          }

          .testimonials-title-chatgpt {
            font-size: 2rem;
            margin-bottom: 0.75rem;
          }

          .testimonials-description-chatgpt {
            font-size: 1.125rem;
          }

          .testimonials-header-chatgpt {
            margin-bottom: 3rem;
          }

          .testimonials-track-chatgpt {
            gap: 1.5rem;
            animation: scroll 40s linear infinite;
          }

          .testimonial-card-chatgpt {
            width: 320px;
            padding: 1.5rem;
            min-height: 250px;
          }

          .testimonial-text-chatgpt {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .testimonial-card-chatgpt {
            width: 280px;
            padding: 1.25rem;
          }

          .testimonials-track-chatgpt {
            gap: 1rem;
            animation: scroll 35s linear infinite;
          }

          .testimonial-text-chatgpt {
            font-size: 0.9rem;
            line-height: 1.6;
          }
        }
      `}</style>
    </section>
  )
}
