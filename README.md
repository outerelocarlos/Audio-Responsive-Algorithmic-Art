# Audio Responsive Algorithmic Art

**Algorithmic art** (also known as algorithm art or computer-generated art) is a subset of generative art (art that in whole or in part has been created with the use of an autonomous system) which uses a scripted algorithm as a detailed recipe for the design and possibly execution of an artwork through computer code, functions, mathematical expressions and/or any other viable input.  

This JavaScript exercise aims to pay homage to algorithmic art through a series of audio-responsive renders. To do so, the [p5.js](https://p5js.org/) library (which is built around creative coding) has been used.  
Note that there is an interactive side to this project:
* To switch between models, press the **1**, **2** and **3** (or, alternatively, the **A**, **S** and **D** keys).
* The **down arrow** and **up arrow** keys switch between the _music mode_ and the _microphone mode_ (respectively, with the _music mode_ being the default one).  
The former plays in loop a brief [Feather](https://www.youtube.com/watch?v=4yX8ZUgraOo) cover by [Vistor (a good friend of mine)](https://www.instagram.com/el._.vistor/) rearranged by myself for this exercise, whereas the latter uses a microphone input to work.  
* Users can speed up/down the song and animation of all renders using the mouse wheel.  
Note that the animation itself can be stopped and even move backwards (any changes are undone upon reloading). Beware that speeding up/down a song modifies its pitch (higher/lower respectively).

The GIFs provided down below are just for illustration purposes - they butcher the animation quality and flow due to the compression and a 30fps cap. However, some web-related audio policies disallow me to host this script (and its renders) so that users can see and interact with it as was intended. To do so, [download the repository](https://github.com/outerelocarlos/Audio-Responsive-Algorithmic-Art/archive/refs/heads/main.zip) and try it out within a local server.

### Permissions

Microphone permission is required for the _microphone mode_ to work. Otherwise, said mode will capture no sound and behave accordingly.  

### Shameless plug

[This other JavaScript exercise](https://github.com/outerelocarlos/Algorithmic-Art) aims to pay homage to algorithmic art through a series of visually harmonic renders. Check it out if you liked this one.

<br>

## Model 1

The first model aims to emulate the look of a randomly generated space-themed videogame.  
The terrain was built using a pair of maps divided in rectangular triangles. A randomly generated noise modifies the maps in their perpendicular axis from the top of the maps' surface to their bottom, mimicking a wave-like motion.

Rotating the maps was required to give depth to the scene, an impression that was further reinforced by the use of color gradients. The three-dimensional perspective allows the wave-like motion to organically create a highland-like scenario.

The terrain and its surface have been design so that the scene can fit two wall-like spectrum analyzers (one at each side of the space road) which divide the audio feed in frequency-based columns (the higher frequency columns are the ones placed the furthest).

A sun was built over the horizon trying to capture some [Outrun](https://www.igdb.com/games/outrun) and [Race the Sun](https://www.igdb.com/games/race-the-sun) vibes. From inside that sun, a circle booms according to the sound's volume; meanwhile, the edge of the sun showcases the recently recorded volume values through a volume histograph, completing the sun's appearance.

A ship was added to reinforce the Outrun-inspired space-themed videogame feel. In order to enhance its integration within the overall scene, a vibration was given to said ship to emulate the turbulence coming from the friction with the planet's air/atmosphere (this vibration is pseudo-random but dependent on the animation/travel speed).

All of the colors in the scene are created from different variables obtained via API call to [OpenWeatherMap](https://openweathermap.org/). Using [Vigo](https://en.wikipedia.org/wiki/Vigo) as reference, all of the color dances, gradients and choices were taken from the city's coordinates, temperatures for the day, humidity levels, cloudiness and wind speed.

Note that there is an interactivity layer exclusive to this model within the **left arrow** and **right arrow** keys.  
Those keys allow the ship to shift left and right (to further emulate the look of a videogame).  
The spaceship can also be hidden using the **H** key (use the same key to bring the ship back in the scene).

<br>

![Model 1](gifs/Model1.gif)

<br>

## Model 2

The second model uses two sets of lines (red and blue) that are created by intersecting several points from a combination of sine and cosine functions.

The functions themselves define the path upon which the lines dance and, for a more artistically satisfying effect, the dominant line of each set has been programmed to have a higher opacity that the one that succeeds it. That trend is continued across all the lines specified in the code (20), with each trailing line being less opaque than its predecessor.

The audio-responsive layer modifies the sine and cosine functions that define the render, transforming the path upon which the lines dance and making said dance react to the audio volume.

<br>

![Model 2](gifs/Model2.gif)

<br>

## Model 3

The third and last model is built around the same functions as the previous one but, instead of using the points the that the previous model intersects to create its lines as mere references, it draws them upon a white canvas creating a lotus-like drawing point by point.

<br>

![Model 3](gifs/Model3.gif)