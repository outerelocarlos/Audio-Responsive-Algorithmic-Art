let mode = 0; //Modo de visualización
let mode_alt = false; //Modo alternativo de visualización
let music = true; //Determina qué audio procesar (true = música, false = input de micrófono)
let enter_if = true; //Determina si entrar en un determinado condicional (comentado posteriormente)

let mic; //Variable que recoge el audio del micrófono
let song; //Variable que almacena la canción importada
let amp; //Variable que recoge la amplitud del audio asociado
let vol; //Variable que recoge el volumen actual del audio asociado
let record = []; //Historial del volumen del audio capturado
let sum; //Suma  de todos los volúmenes del historial
let avg; //Media de todos los volúmenes del historial
let fft; //Tranformada de Fourier aplicada al audio en pos de desglosar el mismo en frecuencias
let spectrum; //Array de valores para cada rango de frecuencias
let siri = new p5.Speech(); //Haciendo uso de la librería p5.speech.js, se crea un asistente de voz

let t = 0; //Tiempo (inicial = 0)
let speed = 1; //Velocidad base (regula el resto de velocidades)

let size = 40; //Tamaño de los polígonos que componen el terreno
let w = 700; //Anchura del terreno
let h = 1700; //Altura del terreno
let cols = w / size; //Número de columnas de polígonos que componen el terreno
let rows = h / size; //Número de filas de polígonos que componen el terreno
let terrain = []; //Array para el terreno
let terrain_advance = 0; //Determina el avance del terreno (inicialmente = 0)

let img; //Imagen de la nave
let ship_angle = 0; //Ángulo de la nave
let ship_translate = 0; //Posición de la nave
let ship_hidden = 0; //Variable que determina si ocultar o no la nave

let lines = 20; //Número de líneas para mode0()
let mod = 1; //Valor que modifica las funciones de mode0()

let Vigo; //Variable que almacena los datos obtenidos de la llamada API a realizar

//Se carga la canción y se reduce su volumen para una ganancia óptima
function preload() {
  song = loadSound('../assets/Space-Feather.mp3');
  song.setVolume(0.3);
}

function setup() {
  cnv = createCanvas(720, 480, WEBGL); //Se crea el canvas pertinente
  
  //Se define e inicializa el micrófono
  mic = new p5.AudioIn();
  mic.start();
  
  //siri.setLang('es');

  //Construcción del grid que dará forma al terreno
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0; //Se asigna valor 0 como punto de partida
    }
  }
  
  //Se llena el array del historial del volumen con un 0 para cada ángulo de la circunferencia (estado inicial)
  for (let i = 0; i < 361; i++) {
    record.push(0);
  }

  img = loadImage('../assets/spaceship.png'); //Se carga la imagen de la nave
  
  //Llamada API (a OpenWeatherMap) para la obtención de información meteorológica de Vigo
  loadJSON(
    'https://api.openweathermap.org/data/2.5/find?q=Vigo,es&units=metric&APPID=13891339b6ee83011c3babaa3b3a3999',
    gotData
  );
  
  //console.log(mic);
  //console.log(song);
  //console.log(capture);

  setTimeout(musicStart, 500); //El timeout permite que la llamada a la función se realice correctamente
}

function draw() {
  //El funcionamiento viene definido por el valor de la variable mode
  if (Vigo) {
    if (mode == 0) {
      mode0();
    } else if (mode == 1) {
      mode1();
    }
  } else {
    background(0);
  }
  
  t += speed; //Progreso en función de la velocidad
  
  //Condicional que alterna entre música y micrófono como esqueletos para el resto del código
  if (enter_if) {
    //Caso 1: la música es el esqueleto del código, y de su procesar se obtiene lo necesario para construír el resto
    if (music) {
      siri.cancel(); //Se silencia al asistente de voz de estar éste hablando

      amp = new p5.Amplitude();
      amp.setInput(song); //Se procesa la canción
            
      fft = new p5.FFT(0.9, 64); //Usando Fourier se desglosa el audio pertinente en un número dado (64) de frecuencias
      fft.setInput(song); //Se asigna la canción a la transformada recién definidaz

      enter_if = false; //Una vez se escoge el esqueleto, el condicional no es requerido
    
    //Caso 2: la música es el esqueleto del código, y de su procesar se obtiene lo necesario para construír el resto
    } else {
      song.stop(); //Se cancela la reproducción de la canción
      siri.speak("The microphone mode is now on"); //Le proporcionamos un texto al asistente de voz para su narración
      
      amp = new p5.Amplitude();
      amp.setInput(mic); //Se procesa el input del micrófono
      
      fft = new p5.FFT(0.9, 64); //Usando Fourier se desglosa el audio pertinente en un número dado (64) de frecuencias
      fft.setInput(mic); //Se asigna el input del micrófono a la transformada recién definida
      
      enter_if = false; //Una vez se escoge el esqueleto, el condicional no es requerido
    }
  }
  
  //Se ajusta el volumen recogido a unos valores convenientes en función del esqueleto escogido
  if (music) {
    vol = amp.getLevel() * 120; 
  } else {
    vol = amp.getLevel() * 15;
  }

  //console.log(vol);
  record.push(vol); //Se van incorporando al array los valores de volumen recogidos
}

//Se detecta el input del usuario para adecuar el funcionamiento del programa a éste
function keyPressed() {
  if (key == 'a' || key == 'A'|| key == '1') {
    mode = 0;
  } else if (key == 's' || key == 'S' || key == '2') {
    background(255);
    mode = 1;
    mode_alt = false;
  } else if (key == 'd' || key == 'D' || key == '3') {
    background(255);
    mode = 1;
    mode_alt = true;
  }

  //Con las flechas arriba/abajo, el usuario iterará entre los dos posibles esqueletos detallados previamente
  if (keyCode === UP_ARROW && music) {
    song.stop();
    music = false;
    enter_if = true;
  } else if (keyCode === DOWN_ARROW && music == false) {
    song.rate(0);
    song.play();
    song.loop();
    music = true;
    enter_if = true;
  }

  //La tecla "h" oculta o muestra la nave
  if (key == 'h' || key == 'H') {
    if (ship_hidden == 0) {
      img = loadImage('');
      ship_hidden = 1;
    } else {
      img = loadImage('../assets/spaceship.png');
      ship_hidden = 0;
    }
  }
}

//Con la rueda del ratón se puede aumentar/disminuir la velocidad base (en la cual se fundamenta el resto)
function mouseWheel(event) {
  if (music || mode != 0) {
    //console.log(event.delta);
    speed += event.delta / 1000;
  }
}

function musicStart() {
  song.rate(0); //De lo contrario, dos canciones son reproducidas pudiendo sólo controlar el rate de una de ellas
  song.play(); //Se inicializa la canción
  song.loop(); //La canción es reiniciada una vez finaliza
}

function mode0() {
  colorMode(HSB); //Se define el modo de color
  angleMode(DEGREES); //Se define la unidad en la que fundamentar los ángulos
  background(0); //Fondo negro para limpiar la pantalla de elementos redundantes
  song.rate(speed); //La velocidad determina el rate de la canción (la velocidad de reproducción de la misma)

  strokeWeight(1); //Grosor del borde
  stroke(0); //Color del borde
  
  //Se define el color a usar por varios elementos haciendo uso de aquellos datos obtenidos en la llamada API
  //Se mezcla dicho color con otro definido por el valor instantáneo del volumen, creando un color que reacciona a éste
  let c = lerpColor(color(7*Vigo.list[0].main.temp_max, 
                          8*Vigo.list[0].main.temp_min, 
                          2*Vigo.list[0].coord.lat), 
                    color(vol * 40), 
                    0.4); //Esta variable es la que determina el % de participación del volumen en el color final
  fill(c); //Se usa el mismo para el relleno de los elementos por venir
    
  push(); //Usamos push para cambiar el sistema de referencia de forma momentánea
  translate(0, -0.45 * height); //Desplazamos el sistema de referencia a conveniencia
  rotate(-165); //Rotamos el sistema de referencia a conveniencia
  
  //Se dibuja a continuación el historial de volumen sobre una circunferencia, asignando valores a los ángulos de la misma
  beginShape();
  for (let i = 0; i < 361; i++) {
    let r = map(constrain(record[i] + 0.1, 0, 8.5), 0, 100, 95, 1400);
    let x = r * cos(i);
    let y = r * sin(i);
    vertex(x, y);
  }
  endShape();
  
  //Para evitar que se dibujen excesivos valores, se limita la cantidad de los mismos a los ángulos de la circunferencia
  if (record.length > 360) {
    record.splice(0, 1);
  }

  //Acompaña al historial una elipse cuyo borde tiene un color dado por la humedad de la ciudad escogida en la llamada API
  strokeWeight(2);
  stroke(Vigo.list[0].main.humidity);
  fill(0);
  ellipse(0, 0, height/2.4, height/2.4);
  
  //Así mismo, otra elipse acompaña al ritmo modificando su tamaño en función del volumen capturado
  noStroke();
  fill(c);
  ellipse(0, 0, constrain(vol * 30, 0, height/2.4), constrain(vol * 30, 0, height/2.4));
  pop(); //Se restaura el sistema de referencia previo
  
  //La suma de los círculos y circunferencias recién descritos/as pretende emular un sol
  
  //Construcción de los spectrum analyzers que dibujan las paredes laterales
  if (fft != undefined) {
    spectrum = fft.analyze(); //Se construye el array a partir del fft definido anteriormente
    for (let i = 0; i < spectrum.length; i++) {
      let w = width / 32; //Anchura de las columnas
      let y = map(spectrum[i], 0, 256, height, 0); //Mapa para determinar la altura de cada rango frecuencial

      //Como anteriormente, se define el color en base a datos extraídos de la llamada API
      //Además, cada columna tendrá un valor diferente en función de su index, dando así lugar a un vistoso gradiente
      fill((Vigo.list[0].clouds.all + 50) - i, (Vigo.list[0].clouds.all + 50) - i, (Vigo.list[0].clouds.all + 50) - i);

      //Se define el grosor y color de los bordes de cada columna
      strokeWeight(4);
      stroke(0);
      
      //Se construye el Spectrum Analyzer del lado izquierdo
      push(); //Usamos push para cambiar el sistema de referencia de forma momentánea
      translate(-0.5 * width, -0.5 * height); //Desplazamos el sistema de referencia a conveniencia
      rotateY(90); //Rotamos el sistema de referencia a conveniencia
      rect(i * w, y, w, height - y); //Se construye la columna dando forma a un rectángulo
      pop(); //Se restaura el sistema de referencia previo

      //Se construye el Spectrum Analyzer del lado derecho
      push(); //Usamos push para cambiar el sistema de referencia de forma momentánea
      translate(0.5 * width, -0.5 * height); //Desplazamos el sistema de referencia a conveniencia
      rotateY(90); //Rotamos el sistema de referencia a conveniencia
      rect(i * w, y, w, height - y); //Se construye la columna dando forma a un rectángulo
      pop(); //Se restaura el sistema de referencia previo
    }
  }

  //Se calcula el valor promedio del volumen procesado
  sum = 0;
  for (let i = 0; i < record.length; i++) {
    sum += record[i] / 10;
  }
  avg = sum / record.length;
  //console.log(avg);
  
  //Nuevo color a partir del anteriormente definido, que es nuevamente mezclado con otro dependiente del volumen
  let c1 = lerpColor(c, color(vol * 50), 0.1);
  
  //Se recurre a una función propia para crear un terreno cuyo relieve viene dado por el valor promedio del volumen procesado
  terra(avg, 1.2*avg, c1); //Nótese que dicho terreno hace servir el color recién construido

  //Se posiciona y carga la nave
  push(); //Usamos push para cambiar el sistema de referencia de forma momentánea
  rotate(ship_angle); //Rotamos el sistema de referencia a conveniencia
  translate(ship_translate, 0.175 * height); //Desplazamos el sistema de referencia a conveniencia
  
  imageMode(CENTER); //Se define el modo de inserción de la imagen en la ventana
  
  //Una vez más, se crea un color a partir de la mezcla de uno conveniente y otro dependiente del volumen
  //Se usa dicho color para teñir la imagen a importar y crear la sensación de que la imagen es ilumidada por el sol
  tint(lerpColor(color(60, 100, 255), color(vol * 35), 0.4));
  
  //Los valores aleatorios emulan turbulencias en la nave
  //Los límites fijados a estos valores vienen dados por la velocidad global y aquella del viento (de la llamada API)
  image(img,
    random(-Vigo.list[0].wind.speed/3000 * speed, Vigo.list[0].wind.speed/3000 * speed) * width,
    random(-Vigo.list[0].wind.speed/3000 * speed, Vigo.list[0].wind.speed/3000 * speed) * height,       
    0.15 * width,
    0.15 * height);
  
  pop(); //Se restaura el sistema de referencia previo
  
  //Se definen los controles para la nave
  if (keyIsDown(LEFT_ARROW) && ship_angle < 24) {
    ship_angle += 3;
    ship_translate -= 0.0075 * width;
  }
  if (keyIsDown(RIGHT_ARROW) && ship_angle > -24) {
    ship_angle -= 3;
    ship_translate += 0.0075 * width;
  }
  //print(ship_angle, ship_translate);
}

//Función para la construcción del terreno
function terra(terrain_noise, advance = 0.25, c = 255) {
  push(); //Usamos push para cambiar el sistema de referencia de forma momentánea
  terrain_advance -= advance * speed; //Velocidad de desplazamiento de las deformaciones del terreno
  var yoff = terrain_advance; //Se guarda el valor en una variable

  //Se genera un mapa de ruido para cada casilla del grid
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -92, 92);
      if (terrain_noise != 0) {
        xoff += terrain_noise;
      } else {
        xoff = 0;
      }
    }
    if (terrain_noise != 0) {
      yoff += terrain_noise;
    } else {
      yoff = 0;
    }
  }

  translate(0, 0.8 * height); //Altura con respecto al terreno
  rotateX(90); //Inclinación del terreno
  translate(-0.5 * w, -0.85*h); //Se posiciona debidamente en terreno en la ventana

  strokeWeight(3); //Grosor de las líneas
  stroke(0); //Color de las líneas

  //Se dibuja el terreno
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    //Se definen los vértices que construirán los triángulos  
    for (let x = 0; x < cols; x++) {
      fill(c);
      vertex(x * size, y * size, terrain[x][y]);
      vertex(x * size, (y + 1) * size, terrain[x][y + 1]);
    }
    endShape();
  }
  pop(); //Se restaura el sistema de referencia previo
}

//Función para la carga de datos de la llamada API sobre la varible dedicada a ello
function gotData(data) {
  Vigo = data;
}

function mode1() {
  colorMode(RGB); //Se define el modo de color
  angleMode(RADIANS); //Se define la unidad en la que fundamentar los ángulos
  song.rate(speed); //La velocidad determina el rate de la canción (la velocidad de reproducción de la misma)

  spectrum = fft.analyze(); //Se construye el array a partir del fft definido anteriormente
  
  //El siguiente condicional determina el funcionamiento de este modo, con dos posibles modos de visualización para el mismo
  if (mode_alt == false) {
    background(0); //Fondo negro
    strokeWeight(4); //Grosor de las líneas

    //Construcción de las líneas en las que se fundamenta este modo
    for (let i = 0; i < lines; i++) {
      stroke(color(255, 0, 0, 192 / (0.25 * (i + 1)))); //Color y opacidad de las líneas rojas
      //Se construyen líneas a partir de la unión de los output de las funciones, que varían al hacerlo t
      line(x1(t + i), y1(t + i), x2(t + i), y2(t + i));
      
      stroke(color(0, 0, 255, 192 / (0.25 * (i + 1)))); //Color y opacidad de las líneas azules
      //Se construyen líneas a partir de la unión de los output de las funciones, que varían al hacerlo t
      line(x1(-t + i), y2(-t + i), x2(-t + i), y1(-t + i));
    }
  } else if (mode_alt == true) {
    stroke(0); //Puntos de color negro
    strokeWeight(4); //Grosor de los puntos

    //Se dibujan los puntos en cuestión a lo largo del recorrido especificado
    point(x1(t), y1(t));
    point(x2(t), y2(t));
    point(x1(t), y2(t));
    point(x2(t), y1(t));
  }
}

//Funciones para mode1(); nótese la participación de spectrum[4] en las mismas
//Este rango de frecuencias varía lo suficiente para no resultar errático pero sí consonante con la música/voz
function x1(t) {
  return sin(t / (mod * 20)) * spectrum[4]/2 + sin(t / 5) * spectrum[4];
}

function y1(t) {
  return cos(t / (mod * 10)) * spectrum[4]/2 + sin(t / 4) * spectrum[4] / 4;
}

function x2(t) {
  return sin(t / (mod * 10)) * spectrum[4] + sin(t) * spectrum[4] / 100;
}

function y2(t) {
  return cos(t / (mod * 20)) * spectrum[4] + cos(t / 12) * spectrum[4] / 10;
}