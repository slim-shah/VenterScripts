#/usr/bin/perl -w
=pod
Fetches complaints from NCCF in bulk
author: Vihari Piratla viharipiratla[at]gmail[dot]com
Date: 7th Oct. 2016
Input: File comma seperated values of name and id of the companies for which the complaints are to be fetched.
=cut

$PHANTOM_BIN = "./phantomjs-2.1.1-macosx/bin/phantomjs";
open $fh, "<data/NCCF_municipality.txt" or die "Can't open the input file!";
while(<$fh>){
    next if /^#/;

    $_=~/(.+?):::(.+)/;
    $x=$1, $y=$2;
    $x=~s/ /_/g;
    print STDERR "Lineno: $.\n";
    print STDERR "$PHANTOM_BIN NCCFFetch.js $y 1>data/NCCF/$x.json\n";
    `$PHANTOM_BIN NCCFFetch.js $y 1>data/NCCF/$x.json`
}
