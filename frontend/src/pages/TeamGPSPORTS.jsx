import React, { useState, useEffect, useRef } from 'react';
import useLanguage from '../hooks/useLanguage';
import './TeamGPSPORTS.css';
import manuImage from '../assets/manu.png';
import pumaImage from '../assets/puma.png';
import laproImage from '../assets/lapro.png';
import obertoImage from '../assets/oberto.png';
import rubenImage from '../assets/ruben.png';
import delfiImage from '../assets/delfi.png';
import sebaImage from '../assets/seba.png';
import paretoImage from '../assets/pareto.png';
import luchaImage from '../assets/lucha.png';
import ceccoImage from '../assets/cecco.png';
import yazImage from '../assets/yaz.png';
import molinariImage from '../assets/molinari.png';
import paredesImage from '../assets/paredes.png';
import chiaraImage from '../assets/chiara.png';
import simonetImage from '../assets/simonet.png';

const TeamGPSPORT = () => {
    const { language } = useLanguage();
    const sectionRefs = useRef([]);
    const content3Ref = useRef(null);

    const [visibleSections, setVisibleSections] = useState([]);
    const [content3Visible, setContent3Visible] = useState(false); // Initial state set to false

    const atletasInfo = {
        es: {
            description: 'El #TeamGPSports está formado por jugadores, entrenadores y deportistas de distintas disciplinas, unidos por una misma filosofía: compromiso, dedicación, trabajo en equipo y pasión por lo que hacen. Desde jóvenes promesas hasta referentes consagrados, acompañamos a cada integrante en su camino, brindando un respaldo cercano y profesional en cada etapa de su carrera. Nuestro equipo no se define solo por lo que logra dentro de la cancha, sino por los valores que representa fuera de ella.',
            atletas: [
            {
                nombre: 'Emanuel “Manu” Ginóbili',
                descripcionCorta: 'Manu Ginóbili es uno de los máximos referentes del deporte argentino a nivel mundial. Ícono del básquet internacional, campeón olímpico, leyenda de la NBA y miembro del Salón de la Fama, su trayectoria trascendió generaciones y fronteras.',
                descripcionLarga: 'Ganador de cuatro anillos con los San Antonio Spurs y protagonista clave de la Generación Dorada que hizo historia en Atenas 2004, Manu es sinónimo de liderazgo, inteligencia en juego y compromiso absoluto con el equipo.',
                descripcionLarga2: 'Hoy, con la misma pasión que mostró dentro de la cancha, forma parte del Team GP Sports, aportando su experiencia, su visión y sus valores a las nuevas generaciones de deportistas.',
                imagen: manuImage,
                alt: 'Manu Ginóbili'
            },
            {
                nombre: 'Luciana Aymar',
                descripcionCorta: 'Luciana Aymar es una de las máximas referentes del deporte argentino a nivel mundial. Conocida como "La Maga", leyenda del hockey sobre césped, ocho veces elegida la mejor jugadora del mundo y abanderada olímpica, su trayectoria inspiró a generaciones.',
                descripcionLarga: 'Ganadora de múltiples medallas olímpicas (plata en Sídney 2000 y Londres 2012, bronce en Atenas 2004 y Pekín 2008) y campeona del mundo en 2002 y 2010, Aymar es sinónimo de talento, liderazgo y pasión por el deporte.',
                imagen: luchaImage,
                alt: 'Luciana Aymar'
            },
            {
                nombre: 'Nicolás Laprovittola',
                descripcionCorta: 'Nicolás Laprovittola es uno de los principales referentes del básquet argentino actual y una figura consolidada en el escenario internacional. Base talentoso, creativo y con gran lectura de juego, ha dejado su huella en las principales ligas del mundo, incluyendo la ACB de España, la Euroliga y la NBA.',
                descripcionLarga: 'Integrante clave de la Selección Argentina, fue subcampeón del mundo en China 2019 y continúa siendo parte fundamental del equipo nacional. A nivel clubes, vistió camisetas históricas como las del Real Madrid y el FC Barcelona, demostrando siempre profesionalismo y liderazgo.',
                descripcionLarga2: 'Nicolás forma parte del Team GP Sports, donde acompañamos su carrera desde los inicios, orgullosos de su evolución constante dentro y fuera de la cancha.',
                imagen: laproImage,
                alt: 'Nicolás Laprovittola'
            },
             {
                nombre: 'Paula Pareto',
                descripcionCorta: 'Campeona olímpica en judo en Río 2016 y medallista de bronce en Beijing 2008. Primera mujer argentina en lograr un oro olímpico. También médica, Paula combina la excelencia deportiva con la vocación por ayudar. Un emblema del deporte argentino y un ejemplo de esfuerzo, valores y resiliencia.',
                imagen: paretoImage,
                alt: 'Paula Pareto'
            },
            {
                nombre: 'Alejandro “Puma” Montecchia',
                descripcionCorta: 'Alejandro Montecchia es una figura emblemática del básquet argentino. Base de enorme inteligencia, carácter y visión de juego, fue una pieza clave de la mítica Generación Dorada, con la que conquistó la medalla de oro en los Juegos Olímpicos de Atenas 2004.',
                descripcionLarga: 'Su carrera se desarrolló en ligas de alto nivel como las de Italia y España, y dejó una huella imborrable en cada equipo por su entrega, liderazgo y capacidad para hacer jugar al equipo.',
                descripcionLarga2: 'Hoy, ya retirado de la actividad profesional, continúa vinculado al deporte como parte del Team GP Sports, aportando su experiencia y mirada a las nuevas generaciones.',
                imagen: pumaImage,
                alt: 'Puma Montecchia'
            },
            {
                nombre: 'Fabricio Oberto',
                descripcionCorta: 'Fabricio Oberto es uno de los grandes emblemas del básquet argentino y mundial. Dueño de una carrera ejemplar, fue parte fundamental de la Generación Dorada, logrando la histórica medalla de oro en los Juegos Olímpicos de Atenas 2004.',
                descripcionLarga: 'A nivel clubes, brilló en la NBA con los San Antonio Spurs, con quienes fue campeón en 2007, y también en ligas de primer nivel como las de Argentina, España y Grecia. Reconocido por su inteligencia táctica, capacidad de liderazgo y compromiso con el equipo, es un referente dentro y fuera de la cancha.',
                descripcionLarga2:'Hoy forma parte del Team GP Sports, donde continúa aportando su experiencia, su visión del deporte y su cercanía con las nuevas generaciones de atletas.',
                imagen: obertoImage,
                alt: 'Fabricio Oberto'
            },
            {
                nombre: 'Rubén Magnano',
                descripcionCorta: 'Entrenador de básquet reconocido a nivel mundial. Condujo a la Selección Argentina a la histórica medalla de oro en los Juegos Olímpicos de Atenas 2004, y a la medalla de plata en el Mundial de Indianápolis 2002. También fue entrenador de las selecciones nacionales de Brasil y Uruguay. Su legado se sostiene en el trabajo, la disciplina táctica y la formación de equipos de élite.',
                imagen: rubenImage,
                alt: 'Rubén Magnano'
            },
            {
                nombre: 'Delfina Merino',
                descripcionCorta: 'Una de las máximas referentes del hockey argentino. Campeona del mundo con Las Leonas en 2010 y medallista olímpica en Londres 2012 y Tokio 2020. Fue elegida Mejor Jugadora del Mundo por la FIH en 2017. Representa liderazgo, constancia y pasión por la camiseta argentina.',
                imagen: delfiImage,
                alt: 'Delfina Merino'
            },
            {
                nombre: 'Sebastián Crismanich',
                descripcionCorta: 'Campeón olímpico en taekwondo en Londres 2012, convirtiéndose en el primer argentino en lograrlo en este deporte. Su consagración marcó un antes y un después para las artes marciales en el país. Ejemplo de perseverancia, superación y humildad dentro y fuera del tatami.',
                imagen: sebaImage,
                alt: 'Sebastián Crismanich'
            },
            {
                nombre: 'Luciano De Cecco',
                descripcionCorta: 'Luciano De Cecco es uno de los máximos referentes del voleibol argentino a nivel mundial. Considerado uno de los mejores armadores del planeta, su visión de juego, precisión y liderazgo lo han convertido en una figura clave de la selección argentina y de los clubes donde ha jugado.',
                descripcionLarga: 'Medallista olímpico de bronce en Tokio 2020, subcampeón mundial en 2002 y múltiple medallista sudamericano, De Cecco ha dejado una marca imborrable en la historia del voleibol argentino. Su habilidad para distribuir el juego y su carisma lo han convertido en un ícono para los aficionados.',
                descripcionLarga2: 'Con una extensa y exitosa carrera en ligas de Italia y Polonia, De Cecco continúa demostrando su vigencia y pasión por el voleibol, inspirando a nuevas generaciones de jugadores en Argentina y en todo el mundo.',
                imagen: ceccoImage,
                alt: 'Luciano De Cecco'
            },
            {
                nombre: 'Diego Simonet',
                descripcionCorta: 'Diego Simonet es un talentoso y reconocido jugador argentino de handball, destacado por su rol como armador central en importantes clubes europeos y en la selección argentina. Su visión de juego, asistencias y capacidad goleadora lo convierten en una figura clave.',
                descripcionLarga: 'Con la selección, Simonet ha sido fundamental en logros históricos como el oro panamericano de 2011 y participaciones olímpicas. Su liderazgo y carisma lo han convertido en un referente e ídolo del handball argentino.',
                imagen: simonetImage,
                alt: 'Diego Simonet'
            },
            {
                nombre: 'Yamila Nizetich',
                descripcionCorta: 'Con una destacada trayectoria como receptora punta, su potencia en ataque, solidez en defensa y carisma la han convertido en una jugadora fundamental para la selección argentina y en diversos clubes a nivel internacional.',
                descripcionLarga: 'Capitana emblemática de "Las Panteras", Nizetich ha liderado al equipo en importantes competencias, incluyendo Juegos Olímpicos y Campeonatos Mundiales. Su entrega, espíritu de lucha y capacidad para motivar a sus compañeras la han transformado en un símbolo del voleibol femenino argentino.',
                imagen: yazImage,
                alt: 'Yamila Nizetich'
            },
            {
                nombre: 'Germán Chiaraviglio',
                descripcionCorta: 'Germán Chiaraviglio es uno de los máximos referentes del salto con garrocha argentino. Con una técnica depurada y una perseverancia admirable, ha representado a Argentina en múltiples competencias internacionales, dejando una marca importante en el atletismo de su país.',
                descripcionLarga: 'Finalista olímpico en Río 2016 y medallista en diversos campeonatos sudamericanos e iberoamericanos, Chiaraviglio ha demostrado una consistencia notable a lo largo de su carrera. Su dedicación al entrenamiento y su espíritu competitivo lo han mantenido en la elite del salto con garrocha durante muchos años.',
                imagen: chiaraImage,
                alt: 'Germán Chiaraviglio'
            },
            {
                nombre: 'Federico Molinari',
                descripcionCorta: 'Federico Molinari desafía la gravedad con cada movimiento. Este gimnasta argentino, especialista en anillas, no solo exhibe una fuerza descomunal, sino también una elegancia y precisión que hipnotizan. Su cuerpo, esculpido por años de dedicación, se convierte en una extensión de las anillas, dibujando figuras imposibles en el aire.',
                descripcionLarga: 'Con participaciones olímpicas y medallas en campeonatos mundiales y panamericanos, Molinari ha llevado la gimnasia artística argentina a escenarios internacionales, dejando una huella imborrable con su potencia y su pasión por este demandante deporte. Su entrega y la búsqueda constante de la perfección lo han convertido en un referente y una fuente de inspiración para atletas de todo el continente.',
                imagen: molinariImage,
                alt: 'Federico Molinari'
            },
            {
                nombre: 'Matias Paredes',
                descripcionCorta:'Participante en múltiples Juegos Olímpicos y Campeonatos Mundiales, Paredes ha sido parte de momentos históricos para el hockey argentino. Su garra, su capacidad táctica y su compromiso con el equipo lo han convertido en una pieza fundamental a lo largo de los años.',
                descripcionLarga: 'Con su experiencia y profesionalismo, Matias Paredes continúa aportando valor a cada equipo donde juega, siendo un ejemplo de dedicación y amor por el deporte para las nuevas generaciones de jugadores de hockey en Argentina.',
                imagen: paredesImage,
                alt: 'Matias Paredes'
            }
        ]},
        en: {
            description: 'The #TeamGPSports is made of players, coaches, and athletes from different disciplines, united by a common philosophy: commitment, dedication, teamwork, and passion for what they do. From young talents to established stars, we support each member on their journey, providing close and professional backing at every stage of their career. Our team is defined not only by what they achieve on the field but also by the values they represent off it.',
            atletas: [
            {
                nombre: 'Emanuel “Manu” Ginóbili',
                descripcionCorta: 'Manu Ginóbili is one of the greatest references of Argentine sports worldwide. An icon of international basketball, Olympic champion, NBA legend, and member of the Hall of Fame, his career transcended generations and borders.',
                descripcionLarga: 'Winner of four rings with the San Antonio Spurs and a key player of the Golden Generation that made history in Athens 2004, Manu is synonymous with leadership, intelligence in play, and absolute commitment to the team.',
                descripcionLarga2: 'Today, with the same passion he showed on the court, he is part of Team GP Sports, bringing his experience, vision, and values to the new generations of athletes.',
                imagen: manuImage,
                alt: 'Manu Ginóbili'
            },
            {
                nombre: 'Luciana Aymar',
                descripcionCorta: 'Luciana Aymar is one of the greatest references of Argentine sports worldwide. Known as "La Maga", a legend of field hockey, eight times chosen as the best player in the world and Olympic flag bearer, her career inspired generations.',
                descripcionLarga: 'Winner of multiple Olympic medals (silver in Sydney 2000 and London 2012, bronze in Athens 2004 and Beijing 2008) and world champion in 2002 and 2010, Aymar is synonymous with talent, leadership, and passion for the sport.',
                imagen: luchaImage,
                alt: 'Luciana Aymar'
            },
            {
                nombre: 'Nicolás Laprovittola',
                descripcionCorta: 'Nicolás Laprovittola is one of the main references of current Argentine basketball and a consolidated figure on the international stage. A talented, creative point guard with great game reading, he has left his mark in the world\'s top leagues, including Spain\'s ACB, the Euroleague, and the NBA.',
                descripcionLarga: 'A key member of the Argentine National Team, he was runner-up in the world in China 2019 and continues to be a fundamental part of the national team. At the club level, he has worn historic jerseys such as Real Madrid and FC Barcelona, always demonstrating professionalism and leadership.',
                descripcionLarga2: 'Nicolás is part of Team GP Sports, where we have accompanied his career from the beginning, proud of his constant evolution both on and off the court.',
                imagen: laproImage,
                alt: 'Nicolás Laprovittola'
            },
            {
                nombre: 'Paula Pareto',
                descripcionCorta: 'Olympic judo champion in Rio 2016 and bronze medalist in Beijing 2008. First Argentine woman to achieve an Olympic gold. Also a medical doctor, Paula combines sporting excellence with a vocation for helping. An emblem of Argentine sport and an example of effort, values, and resilience.',
                imagen: paretoImage,
                alt: 'Paula Pareto'
            },
            {
                nombre: 'Alejandro “Puma” Montecchia',
                descripcionCorta: 'Alejandro Montecchia is an emblematic figure of Argentine basketball. A point guard with great intelligence, character, and game vision, he was a key piece of the legendary Golden Generation, with which he won the gold medal at the Athens 2004 Olympic Games.',
                descripcionLarga: 'His career developed in high-level leagues such as those in Italy and Spain, and he left an indelible mark on every team for his dedication, leadership, and ability to make the team play.',
                descripcionLarga2: 'Today, already retired from professional activity, he remains linked to the sport as part of Team GP Sports, bringing his experience and perspective to new generations.',
                imagen: pumaImage,
                alt: 'Puma Montecchia'
            },
            {
                nombre: 'Fabricio Oberto',
                descripcionCorta: 'Fabricio Oberto is one of the great emblems of Argentine and world basketball. Owner of an exemplary career, he was a fundamental part of the Golden Generation, achieving the historic gold medal at the Athens 2004 Olympic Games.',
                descripcionLarga: 'At the club level, he shone in the NBA with the San Antonio Spurs, with whom he was champion in 2007, and also in top leagues such as those in Argentina, Spain, and Greece. Recognized for his tactical intelligence, leadership ability, and commitment to the team, he is a reference both on and off the court.',
                descripcionLarga2: 'Today he is part of Team GP Sports, where he continues to contribute his experience, vision of the sport, and closeness to new generations of athletes.',
                imagen: obertoImage,
                alt: 'Fabricio Oberto'
            },
            {
                nombre: 'Rubén Magnano',
                descripcionCorta: 'World-renowned basketball coach. He led the Argentine National Team to the historic gold medal at the Athens 2004 Olympic Games and the silver medal at the Indianapolis 2002 World Cup. He has also coached the national teams of Brazil and Uruguay. His legacy is based on work, tactical discipline, and the formation of elite teams.',
                imagen: rubenImage,
                alt: 'Rubén Magnano'
            },
            {
                nombre: 'Delfina Merino',
                descripcionCorta: 'One of the top references of Argentine hockey. World champion with Las Leonas in 2010 and Olympic medalist in London 2012 and Tokyo 2020. She was named Best Player in the World by the FIH in 2017. She represents leadership, consistency, and passion for the Argentine jersey.',
                imagen: delfiImage,
                alt: 'Delfina Merino'
            },
            {
                nombre: 'Sebastián Crismanich',
                descripcionCorta: 'Olympic champion in taekwondo in London 2012, becoming the first Argentine to achieve this in this sport. His consecration marked a before and after for martial arts in the country. An example of perseverance, overcoming, and humility both inside and outside the tatami.',
                imagen: sebaImage,
                alt: 'Sebastián Crismanich'
            },
            {
                nombre: 'Luciano De Cecco',
                descripcionCorta: 'Luciano De Cecco is one of the top references of Argentine volleyball worldwide. Considered one of the best setters on the planet, his game vision, precision, and leadership have made him a key figure for the Argentine national team and the clubs where he has played.',
                descripcionLarga: 'Medalist in the Tokyo 2020 Olympics, world runner-up in 2002, and multiple South American medalist, De Cecco has left an indelible mark on the history of Argentine volleyball. His ability to distribute the game and his charisma have made him an icon for fans.',
                descripcionLarga2: 'With an extensive and successful career in leagues in Italy and Poland, De Cecco continues to demonstrate his relevance and passion for volleyball, inspiring new generations of players in Argentina and around the world.',
                imagen: ceccoImage,
                alt: 'Luciano De Cecco'
            },
            {
                nombre: 'Diego Simonet',
                descripcionCorta: 'Diego Simonet is a talented and recognized Argentine handball player, known for his role as a central playmaker in important European clubs and the Argentine national team. His game vision, assists, and scoring ability make him a key figure.',
                descripcionLarga: 'With the national team, Simonet has been fundamental in historic achievements such as the Pan American gold in 2011 and Olympic participations. His leadership and charisma have made him a reference and idol of Argentine handball.',
                imagen: simonetImage,
                alt: 'Diego Simonet'
            },
            {
                nombre: 'Yamila Nizetich',
                descripcionCorta: 'Con una destacada trayectoria como receptora punta, su potencia en ataque, solidez en defensa y carisma la han convertido en una jugadora fundamental para la selección argentina y en diversos clubes a nivel internacional.',
                descripcionLarga: 'An emblematic captain of "Las Panteras", Nizetich has led the team in important competitions, including the Olympic Games and World Championships. Her dedication, fighting spirit, and ability to motivate her teammates have made her a symbol of Argentine women\'s volleyball.',
                imagen: yazImage,
                alt: 'Yamila Nizetich'
            },
            {
                nombre: 'Germán Chiaraviglio',
                descripcionCorta: 'Germán Chiaraviglio is one of the top references of Argentine pole vaulting. With a refined technique and admirable perseverance, he has represented Argentina in multiple international competitions, leaving an important mark on his country\'s athletics.',
                descripcionLarga: 'An Olympic finalist in Rio 2016 and medalist in various South American and Ibero-American championships, Chiaraviglio has shown remarkable consistency throughout his career. His dedication to training and competitive spirit have kept him at the elite of pole vaulting for many years.',
                imagen: chiaraImage,
                alt: 'Germán Chiaraviglio'
            },
            {
                nombre: 'Federico Molinari',
                descripcionCorta: 'Federico Molinari defies gravity with every movement. This Argentine gymnast, a specialist in rings, not only exhibits tremendous strength but also elegance and precision that mesmerize. His body, sculpted by years of dedication, becomes an extension of the rings, drawing impossible figures in the air.',
                descripcionLarga: 'With Olympic participations and medals in world and Pan American championships, Molinari has taken Argentine artistic gymnastics to international stages, leaving an indelible mark with his power and passion for this demanding sport. His dedication and constant pursuit of perfection have made him a reference and a source of inspiration for athletes across the continent.',
                imagen: molinariImage,
                alt: 'Federico Molinari'
            },
            {
                nombre: 'Matias Paredes',
                descripcionCorta: 'Participant in multiple Olympic Games and World Championships, Paredes has been part of historic moments for Argentine hockey. His grit, tactical ability, and commitment to the team have made him a fundamental piece over the years.',
                descripcionLarga: 'With his experience and professionalism, Matias Paredes continues to add value to every team he plays for, being an example of dedication and love for the sport for new generations of hockey players in Argentina.',
                imagen: paredesImage,
                alt: 'Matias Paredes'
            }
        ]},
    };

    const currentAtletas = atletasInfo[language]?.atletas || atletasInfo.es.atletas;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Handle athlete sections
                    const index = sectionRefs.current.indexOf(entry.target);
                    if (index !== -1) { // Check if it's an athlete section
                        if (entry.isIntersecting) {
                            setVisibleSections((prev) => {
                                if (!prev.includes(index)) {
                                    return [...prev, index];
                                }
                                return prev;
                            });
                        } else {
                            setVisibleSections((prev) => prev.filter((item) => item !== index));
                        }
                    }

                    // Handle content3Ref (the main description)
                    if (entry.target === content3Ref.current) {
                        setContent3Visible(entry.isIntersecting);
                    }
                });
            },
            {
                threshold: 0.3, // Adjust this value as needed
            }
        );

        // Observe the content3Ref
        if (content3Ref.current) {
            observer.observe(content3Ref.current);
        }

        // Observe all athlete sections
        sectionRefs.current.forEach((section) => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="team-gpsports-container">
            <h2>#TeamGPSports</h2>
            <p ref={content3Ref} className={`content3 ${content3Visible ? 'fade-in-right' : ''}`}>{atletasInfo[language].description}</p>
            {currentAtletas.map((atleta, index) => (
                <div
                    className={`section ${index % 2 !== 0 ? 'reversed' : ''}`}
                    key={index}
                    ref={(el) => (sectionRefs.current[index] = el)}
                    style={{
                        opacity: visibleSections.includes(index) ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                    }}
                >
                    <div className="image-container">
                        <img src={atleta.imagen} alt={atleta.alt} />
                    </div>
                    <div className="text-container">
                        <h3>{atleta.nombre}</h3>
                        <p>{atleta.descripcionCorta}</p>
                        <p>{atleta.descripcionLarga}</p>
                        {atleta.descripcionLarga2 && <p>{atleta.descripcionLarga2}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeamGPSPORT;