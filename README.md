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
docker run -d -p 9501:9501 -e S3_URL=https://s3.url -e S3_REGION=it jordan886/radosgw-admin-exporter
```

you can manage the environment variables using a .env file
Example:
```
docker run -d -p 9501:9501 --env-file .env jordan886/radosgw-admin-exporter
```


### Environmennt Variables ###

| Variable                      | Example                          | Description  |	
| :-----------------------------|:--------------------------------:|:-------------|
| S3_URL **(required)** 	      |	https://s3.scalablestorage.it    | url where your s3 storage reside (only https with a valid certificate) |
| S3_REGION **(required)** 	    |	it-mi1                           | region of user (required for SignatureV4) |
| S3_ACCESS_KEY **(required)** 	|	user                             | the user access key |
| S3_SECRET_KEY **(required)**  | secret                           |  the user secret key |
| FILTER_TYPE                   |	bucket                           | see filters section |
| FILTER_LIST	                  |	bucket01,bucket02,bucketN        | see filters section |
| EXPORTER_PORT 	              |	9501                             | if you need to override the default port |
| EXPORTER_METRICS_PREFIX  	    |	s3                               | see prefix section |

### Filters

the exporter can expose metrics exclusively for specified users/buckets, by default will expose all metrics of all buckets
this can be useful if you don't wont to overload the API for large clusters
*FILTER_TYPE* can be type user or bucket, the user type will expose all buckets owned by the specified user(s)
*FILTER_LIST* is a comma separated list of users or buckets, metrics will only be exposed for those objects

### Prefix
if you manage a large Prometheus cluster you can add a custom prefix to easily find them inside Prometheus
**Example** 
EXPORTER_METRICS_PREFIX=s3 will change metrics num_objects to s3_num_objects
**You don't need to specify _ it's automatically appended**

## Contributing

Anyone is free to contribute, any suggestion, improvement or bugfixing is much welcome

## Authors

* Giordano Corradini - *Initial work*


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE](LICENSE) file for details