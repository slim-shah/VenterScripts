=begin
Fetches the full company list from http://www.complaintboard.in/viewcompanies/
author: Vihari Piratla
Date: 5th Oct. 2016
RUNNING THIS SCRIPT WILL GET YOU BANNED FROM COMPLAINTBOARD
DO NOT REMOVE THE INTENTIONAL SLEEP IN THE LOOP else it can get you banned -- this does not work anyway.
=cut

#/usr/bin/perl -w
use List::Util qw(min);

$NUM_PAGES = 3027;
#$NUM_PAGES = 5;
print "Name,ID\n";
$pid1 = fork();
$pid2 = fork();
die "Could not fork threads!!" if $pid1==-1||$pid2==-1;
$st = ($pid1==0?0:2)+($pid2==0?0:1);
$Q = (($NUM_PAGES-$NUM_PAGES%4)/4)+1;
for($p=$st*$Q;$p<min(($st+1)*$Q,$NUM_PAGES);$p++){
    $url = "http://www.complaintboard.in/viewcompanies/";
    if($p>0){
	$url.="page/".($p+1);
    }
    $c = `curl -s $url`;
    while($c=~/<td class="compl-text"><a href="(.*?\.html)">([^<]+)<\/a><\/td>/g){
	print "\"$2\",$1\n";
    }
    if($p%10==0){
        print STDERR "THREAD:$st ($p/$Q)\n";
    }
}

while(wait()!=-1){}
