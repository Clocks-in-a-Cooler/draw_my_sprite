var test_level =  [
    "     #############################################",
    "     #VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV #",
    "     #                                          <#",
    "     #                                          <#",
    "  $  #                                     oo   <#",
    "                                         ####   <#",
    " #                                       #>     <#",
    " #########################################>     <#",
    "##       #                               #>     <#",
    "#        #                               #>  ## <#",
    "#      @ #                               #>     <#",
    "#   oo   #       ^#                      #>     <#",
    "#   ########    ###^#^#^###############  #>   o <#",
    "#         ###     #######             #  #>  #####",
    "#         ####    #                   #  #>     <#",
    "#         ##      #                   #  #>     <#",
    "#         ##  oo  #                   #  #>  o  <#",
    "#         ## ###  #                   #  #####  <#",
    "#         ##      #                   #  #>     <#",
    "#         ##      #                   #  #>     <#",
    "#         ##      #                   #  #>   oo<#",
    "#         ##   ## #                   #  #>  #####",
    "##o       ##      #                   #  #>     <#",
    "  #o      ##  oo  #                   #  #>     <#",
    "   #o     ## ###  #                   #  #> o   <#",
    "    #             #                   #  #####  <#",
    "     #^o          #                   #  #>     <#",
    "      ##       ###                    #         <#",
    "        #    ^   #                    #oo       <#",
    "         #########                   #############"
];

var GAME_LEVELS = [
    ["##################################################",
     "#                                                #",
     "#                               oo  oo          $#",
     "#            ooo                               ###",
     "#                               ##  ##           #",
     "#            ###                               oo#",
     "#                                            #####",
     "# @                                              #",
     "#        ooo             ^^   ##^^##^^##^^#   o o#",
     "##################################################"],

    ["########                                                                                     #######",
     "#      #                     $       ##                                                            #",
     "#      #                  ######                                                                   #",
     "#    @ #  oo  oo                                                                             # #####",
     "#   ####  ##  ##                  ##   ###                                                   #     #",
     "#      #                       o # #   <# # o                                             ####     #",
     "#      #^        oo             #  #   <#  #                                                 ##### #",
     "#      ##        ##           <#   ##  <#   #>                       oo   oooo    o          #     #",
     "###    ##    ^                 V   #   <#   V                      #####################     #     #",
     "#            #                     #   <#                           ####################     # #####",
     "#         oo #    oo               #   <#                           ###################      #     #",
     "#   ##########    ##   oo          ##  <#                              ###############       #     #",
     "#      #               ##          #   <#                                                    ##### #",
     "#      #                           #   <#                                                    #     #",
     "#      #^ ^ ^ ^ ^                  #   <#                                                    #     #",
     "####   ## # # # # ^      #         ##  <#                                                    # #####",
     "#      ##         #        oo      #   <#                                                    #     #",
     "#                                  #   <#                                                    #     #",
     "#             oo  #        ##      #   <#                                                    ##### #",
     "#   ###############                ##  <#                                                    #     #",
     "#      #              o o      oo  #   <#   oo        o       ooo      o o       o        oo #     #",
     "#      #              ###      ##  #   <#  #####    #####    #####    #####    #####     ##### #####",
     "#      #^                          #   <#  #####    #####    #####    #####    #####     #####     #",
     "####   ##    oo   oo      o o      ##  <#   ###      ###      ###      ###      ###       ####     #",
     "#      ##    ##   ##      ###     #      #################  ################  #################### #",
     "#                                                                                                  #",
     "#                                                                                                  #",
     "#   ########################################################################################## #####",
     "#      ###########################    ########################################################     #",
     "#      ###########################    ##########################################VVVVVVVVVVV###     #",
     "#      ###########################    ##########################################           ####### #",
     "####   ##########    #############o  o###      #################################                   #",
     "#      ##########o  o##############  ####      #################################                   #",
     "#      ##########    #############    ###      #################################  o o o o   ## #####",
     "#      ###########  ##############    ###^    ^###############################################     #",
     "#   ##############  ##############o  o####^  ^################################################     #",
     "#                ##               #  ######  ##################################################### #",
     "#                                                                                                  #",
     "#                                                                                                  #",
     "####################################################################################################"],
    
    ["                    ",
     "     o              ",
     "    ###             ",
     "                    ",
     "          #         ",
     "         # #        ",
     "        #   #       ",
     "                    ",
     "      o       o     ",
     "      #       #     ",
     "      #       #     ",
     "     o#o     o#o    ",
     "     ###     ###    ",
     "      #       #     ",
     "    o   o   o   o   ",
     "    #####   #####   ",
     "  #   #   #   #   # ",
     "                    ",
     "                    ",
     "# # # # # # # # # # ",
     "                    ",
     "                    ",
     "                    ",
     "# # # # # # # # # # ",
     "                    ",
     "                    ",
     " # # # # # # # # # #",
     "      o             ",
     "                    ",
     "     ##  o o        ",
     "              o     ",
     "         ###        ",
     "  o o         ##    ",
     "  ###             o ",
     "            o       ",
     "           ##    ## ",
     "        o           ",
     "                    ",
     "        ###   ###   ",
     "                    ",
     "   o                ",
     "  ###               ",
     "         o          ",
     "                    ",
     "  #    #         #  ",
     "            #       ",
     "              #     ",
     "    ^   #           ",
     "    #            #  ",
     "            #       ",
     "#        #          ",
     "V                #  ",
     "    <#        #     ",
     "                    ",
     "       o #  o       ",
     "#    #              ",
     "               #    ",
     "   #        ^       ",
     "        #   #   #   ",
     "      ^             ",
     "  ^   #             ",
     "  #        #        ",
     "             o #  # ",
     " o    o             ",
     "                    ",
     "   #     #     #    ",
     "                    ",
     "     #              ",
     "            #     # ",
     " #                  ",
     "        ##     #    ",
     "                    ",
     "       #            ",
     "             ##     ",
     "   ###              ",
     "                  o ",
     "         oo      ###",
     "##      ####        ",
     "                    ",
     "                    ",
     "o            o o    ",
     "      ^^^    ###   o",
     "##    ###           ",
     "           #      ##",
     "                    ",
     "         oo         ",
     "        ###         ",
     "    @               ",
     "                $   ",
     "   ###         ###  "],
];