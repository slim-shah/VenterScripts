#/usr/bin/bash

if [ -z "$1" ] 
then
    echo "Argument required... Supply the folder containing ICMC data jsons";
    exit;
fi

echo "Total number of media links"
cat $1/*.json|perl -ane 'while(/complaint_images":\[([^\]]+?)\]/g){print $1."\n";$m=0;while($1=~/"large_uri"/g){$m++;}print "$m\n"}'|perl -ane 'BEGIN{$i=0;}chomp;$i=$i+$_;END{print "$i\n"}'

echo "----";echo "Complaints created by year";
cat $1/*.json |perl -ane 'while(/complaint_created":"(20[0-9]{2})\-/g){print $1."\n"}'|sort|uniq -c|sort -rn

echo "-----";echo "Total number of words";
cat $1/*.json |perl -ane 'while(/complaint_description":"([^"]+)"/g){print $1."\n"}'|wc -w

echo "-----" echo "Total number of complaints";
cat $1/*.json |perl -ane 'while(/complaint_description":"([^"]+)"/g){print $1."\n"}'|wc -l
