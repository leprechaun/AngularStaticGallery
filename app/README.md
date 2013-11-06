Angular Static Gallery
======================

This is just me playing with AngularJS. My friends and relatives have been asking for pictures since I've left my home country a while ago. I never wanted to invest much time in that respect. However, I do keep my pictures nominally well organized using Shotwell. Tagging pictures has proved enough. Therefore, I can resuse my shotwelldata.

* Extract the database in json
* Copy the *already made* thumbnails

So, yeah, I can run my script, rsync the static files and that's it.

This project is, uhm, very heavily inspired by AngularJS's demo project Google Phone List. By "heavily inspired", I mean I shamelessly stole the code and made it uglier with a picture gallery functionality.


Assumptions
-----------

So, this site will assume that under the web root, you have the following data hierarchy:

    data/
         pictures/
                  1.json
                  2.json
                  n.json
                  all-pictures.json
         tags/
              tag-one.json
              tag-two.json
              tag-n.json
              all-tags.json
         thumbnails/
                    [the files names are referenced in the tag files]

Theoretically, the images and thumbnails could be hosted anywhere statically. The json data should be on the same domain as the gallery, though.

You should really just test it with ShotwellExtractor.
