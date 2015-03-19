=== GENERATOR ===
<i>A framework for creating dynamic content for table-top gaming using javascript
(c) 2009 Robert Kurcina</i>

== REVISION HISTORY ==
= 2009.07.05 - version 0.7.4 =
           - apparent google's excanvas doesn't print well for MSIE
           - experimenting with jsDraw2D; supports MSIE very well but is LGPL
           
= 2009.07.05 - version 0.7.3 =
           - played around with raphael.js and processing.js; neither supports
             multiple canvases.
           - looked at cvsGraphLib which does support multiple canvases but
             the documentation is horrid.
           - therefore began working on raw canvas map generator and will
             seek to get it ported to a WML version runnable by MSIE.
           
= 2009.07.03 - version 0.7.2 =
           - added Scenario.js and Campaign.js
           
= 2009.07.02 - version 0.7 =
           - 0.6.1; corrected javascript errors in NameGenerator.js and within
             Cardsheet.js.  Also, removed { width: auto } from Modal.js because
             it doesn't play nice with MSIE7.
           - updated CSS styling; body { font-size: 75%; }
           - installed jquery.ui.buttons
           
= 2009.06.30 - version 0.6 =
           - completed Roster module; first draft.  Needs to be refactored into
             into two classes; one decoupled for top-level use as a FieldEditor           

= 2009.06.29 - version 0.5 =
           - added jquery.ui module
           - removed impromptu from code-base; doesn't manage screen overflow
           - added Modal.js to standardize modal dialogs via jquery.ui.all
           - card backs and faces now have proper cut-lines
           - now Team definitions like "3,2xMilitary" where the '3' is allowed
           - altered Modal to allow multiple modal dialog windows
           
= 2009.06.28 - version 0.4 =
           - update jquery to 1.3.2
           - utlized cleaned evals for Character and Roster class in order to
             avoid compicated if/else tree; benefits later additions to Types
           - corrected misplaced '.' in NameGenerator module
           - altered Cardsheet form to have more information
           - added lookup(), contains() to Utilities module
           - wip /ATZ/final/hmm.html has modal edit view

= 2009.06.27 - version 0.3 =
           - corrected Template module and CSS to allow multi-page printing
           - created nicer tall cards; there's now tall.star and tall.grunt
           - corrected weapons info table to print multiple items
           - updated Dice module for jquery impromptu output
           - added ability to view/print a sheet of blank cards or card backs
           
= 2009.06.26 - version 0.2 =
           - added impromptu modal dialog
           - stylized weapons info tables
           - updated wide.star and wide.grunt artworks
           
= 2009.06.23 - version 0.1 =
           - drafted by Robert Kurcina 
           
== TODO ==
= 2009.07.03 =
   - need to create weighted building generation for ATZ Scenario module
   - need to create icons, banners, and possible map generator for ATZ Scenario module
   - need to create "Regional Map" feature for ATZ Scenario module
   - need to create disclosure methods for tables
   - need to create Table.getSelectBox by culling from //final/campaign.html
   - need to create @import for CSS
   - need to utilize $.loadScript([javascript files]) for JavaScript
   - need to create CSV/white-space parser
   - need to create XML parser
   - need to change list object structure to table
   - need to add credits to list all modules and libraries