
#enters backups folder 
cd ../
cd backups

files=(./*.sql)

PS3='Select backup to restore, or 0 to exit: '
select file in "${files[@]}"; do

    if [[ $REPLY == "0" ]]; then
        echo 'Bye!'
        exit
    elif [[ -z $file ]]; then
        echo 'Invalid choice, try again'
    else
        latest=$file
        break
    fi
done


docker exec -i postgres-ibe pg_restore -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f $latest
cd ../