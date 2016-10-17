#/usr/bin/perl -w
=pod
Bulk fetch from IChnageMyCity.com
=cut
use Time::HiRes qw(usleep);

$MAX_PAGES = 8000;
#The sity name should make a valid url.
#For example, the city name for Bhubaneswar is bhubaneswar due to the url:http://www.ichangemycity.com/bhubaneswar/"
#Bangalore -> bangalore
#Mumbai -> mumbai/smw [http://www.ichangemycity.com/mumbai/smw/]
#Delhi -> delhi [http://www.ichangemycity.com/delhi/] 
$CITY = "delhi";#"delhi";#"mumbai/smw";#"bhubaneswar";
$CITY_ID = $CITY;
$CITY_ID =~ s/[^0-9a-zA-Z]/_/g;
$COOKIE_FILE = "cookies/ICMC_${CITY_ID}_cookie.txt";
`curl -s -c $COOKIE_FILE "http://www.ichangemycity.com/$CITY/"`;
for($numPages=5000;$numPages<$MAX_PAGES;$numPages++){
    print "$numPages/$MAX_PAGES\n" if $numPages%10==0;
    $url = "http://www.ichangemycity.com/card/get_complaints/".$numPages."?agency=0&category_id=0&lat=0&lon=0&status_id=0&sub_category=0";
    #print "$url\n";
    `curl -b $COOKIE_FILE -s \"$url\" >data/ICMC/$CITY_ID/$numPages.json`;
    #sleep for 0.1s
    usleep(100);
}
