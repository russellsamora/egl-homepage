<!--
          .         .
          |         |
,-. ,-. ,-| ,-. ;-. |-. ,-. ;-. ,-:
|   | | | | |-' | | | | |-' |   | |
`-' `-' `-' `-' ' ' `-' `-' '   `-|
                                `-'
-->

#EGL wesbite

##Environment Setup

Clone the repository (or fork it):
    $ git clone https://github.com/engagementgamelab/egl-homepage.git

Install MAMP (Mac Apache MySQL PHP) or the appropriate AMP for your machine.

PHP and MySQL are only used for the whiteboard drawings and the game information.  Setup a two DBs (like on the GoDaddy server) for the whiteboard and the game info.  Alter the code in /db to configure to your machine.

##CSS

Bootstrap 2.3.2 was used for responsive.  More specifically Flatstrap (a flat design version of it).  Everything is written in LESS and must be precompiled (I prefer LiveReload but there are plenty of LESS compiling options).  The folder you should care about is /custom-less.  This is where all the CSS edits should be made.  The only files that are watched are custom-boostrap.less and custom-game.less.

