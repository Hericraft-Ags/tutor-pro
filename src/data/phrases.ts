import type { Language, Level } from '../types';

const PHRASES: Record<Language, Record<Level, string[]>> = {
  es: {
    1: [
      "el sol sale", "la luna brilla", "mi casa es azul", "el perro ladra", "la flor es roja",
      "veo un ave", "juego futbol", "me gusta leer", "el pasto es verde", "papa y mama"
    ],
    2: [
      "El gato duerme en el sofa", "La mariposa vuela alto", "Me gusta comer manzanas", "El lapiz escribe bien", "Mi amigo se llama Luis",
      "La escuela es divertida", "El cielo tiene nubes", "El coche rojo es rapido", "La pelota rebota mucho", "Hoy es un dia soleado"
    ],
    3: [
      "El explorador descubrio una cueva secreta", "El astronauta viajo a la galaxia lejana", "El leon es el rey de la selva africana", "La tecnologia moderna cambia el mundo", "El chocolate es mi postre favorito siempre",
      "La biblioteca tiene muchos libros interesantes", "El invierno trae nieve y mucho frio", "La musica clasica me relaja por la tarde", "Los pajaros cantan al amanecer cada dia", "El tren electrico cruza la ciudad rapidamente"
    ],
  },
  en: {
    1: [
      "the sun is up", "the moon is big", "my house is blue", "the dog barks", "the red flower",
      "i see a bird", "i play soccer", "i like to read", "the grass is green", "mom and dad"
    ],
    2: [
      "The cat sleeps on the sofa", "The butterfly flies high", "I like to eat apples", "The pencil writes well", "My friend is named Luis",
      "School is very fun", "The sky has many clouds", "The red car is fast", "The ball bounces a lot", "Today is a sunny day"
    ],
    3: [
      "The explorer discovered a secret cave", "The astronaut traveled to a distant galaxy", "The lion is the king of the african jungle", "Modern technology changes the world", "Chocolate is always my favorite dessert",
      "The library has many interesting books", "Winter brings snow and a lot of cold", "Classical music relaxes me in the afternoon", "The birds sing at dawn every day", "The electric train crosses the city quickly"
    ],
  }
};

export default PHRASES;
