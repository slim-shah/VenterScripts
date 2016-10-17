#/usr/bin/sh
if [ -z $1 ]
then
    echo "Argument required: supply the folder containing all the jsons extracted from NCCF";
    exit;
fi

cat $1/*json|perl -ane 'print "$1::$2::$3\n" if/numPosts\":([0-9]+),\"numWords\":([0-9]+),\"numMedia\":([0-9]+)/'|perl -ne 'BEGIN{$x=0,$y=0,$z=0;}@f=split("::");$x+=$f[0];$y+=$f[1];$z+=$f[2];END{print "$x::$y::$z\n"}'
