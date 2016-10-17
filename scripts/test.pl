#/usr/bin/perl -w
$pid1  = fork();
$pid2 = fork();
die if $pid1==-1||$pid2==-1;
$Q = 25;
$st = ($pid1==0?0:2)+($pid2==0?0:1);

for($i=$Q*$st;$i<$Q*($st+1);$i++){
    print $i."\n";
}

while(wait()!=-1){}
