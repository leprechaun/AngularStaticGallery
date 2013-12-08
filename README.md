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
              12345.json
                {
                    "id": 12345,
                    "path": "some/where/a/file.jpg", # path relative to pictures_base_path variable
                    "title": "An Awesome Picture!",
                    "datetime": "1999/12/31 23:59:59",
                    "size": { width: 1200, height: 900 },
                    "tags": ["New Year", "Good times"],
                    "exif": {
                        # optional. raw hash as extracted by pyexif. Gallery can use 2 pieces of information
                        "Image Orientation": any INT between 1 and 8. Google it.
                        "GPS GPSL(ongi|ati)tude": rational numbers. see how pyexif does it.
                    }
                }
         tags/
              all-tags.json
                [
                  {
                    "name": "MyTag", 
                    "thumbnail": "thumb0000000000004077.jpg", 
                    "picture_count": 88
                  }
                ]
              MyTag.json
                {
                    "name": "MyTag", 
                    "thumbnail": "thumb0000000000004473.jpg", 
                    "pictures": [
                        {
                            "id": 12345,
                            "title": "2013-04-07 14:54:40",
                            "thumbnail": "thumb0000000000004473.jpg" # Thumbnail path relative to thumbs_base_path variable
                        }
                     ],
                    "picture_count": 88
                }


Theoretically, the images and thumbnails could be hosted anywhere statically. The json data should be on the same domain as the gallery, though.

You should really just test it with ShotwellExtractor. http://github.com/leprechaun/ShotwellExtractor
