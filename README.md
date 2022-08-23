# radosgw-admin-exporter
A Prometheus Exporter that use Ceph radosgw admin API

### Prerequisites

You need to add admin capabilities to an existing radosgw user, the minimum caps are:

```
radosgw-admin caps add --uid=api-user --caps="buckets=read,users=read,metadata=read"
```

### Usage

The exporter can run standalone or as docker container, docker is the reccomended method.
All the configuration is passed with Env Variables

Example:
```
docker run -d -p 9501:9501 jordan886/radosgw-admin-exporter
```
### Variables ###

| Parameter                     | Example                | Description  |	
| :-----------------------------|:----------------------:|:-------------|
| --url **(required)** 	        |	s3.scalablestorage.it  | url where your s3 storage reside |
| --region **(required)** 	    |	it-mi1                 | the region |
| --access-key **(required)**   | user                   | the s3 user access key |
| --secret-key **(required)** 	|	secret                 | the user secret key |


## Contributing

Anyone is free to contribute, any suggestion, improvement or bugfixing is much welcome

## Authors

* Giordano Corradini - *Initial work*


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE](LICENSE) file for details