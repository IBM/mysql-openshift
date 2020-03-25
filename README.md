# mysql-openshift

This tutorial can teach you how to create a MySQL instance on Red Hat OpenShift on IBM Cloud and integrate it to your microservices-based application, which is also deployed on Red Hat OpenShift.

Note: This tutorial assumes you already have a provisioned OpenShift cluster. You can provision your own cluster from here: [Red Hat OpenShift on IBM Cloud](https://cloud.ibm.com/kubernetes/catalog/about?platformType=openshift).


The tutorial is divided into 2 main parts:

1. **[Creating a new MySQL instance and adding data to the database](#creating-a-new-mysql-instance-and-adding-data-to-the-database)**
2. **Deploying a microservices-based application and integrating it to our database:**

# Creating a new MySQL instance and adding data to the database.
The first step is to create a MySQL instance from the webconsole.

## Create a new project
`oc new-project mysql-test`  

## Create MySQL database
`oc new-app mysql-ephemeral --name mysql`  

## Populate database  

**NOTE that you must change the user and password values in the following script before running it.**

## Create the getCustomer service
#### Note: The variables 'MYSQL_USER' and 'MYSQL_PASSWORD' are determined by the values returned after you create the ephemeral MySQL application, above.  

`oc new-app https://github.com/mohameddsheriff/mysql-openshift --context-dir=src/getCustomer --name getcustomer -e MYSQL_HOST=mysql -e MYSQL_DATABASE=sampledb -e MYSQL_USER=userP1F -e MYSQL_PASSWORD=eRwTuVSW1MhsIUHw`  

## Create the getCustomerSummaryList service
#### Note: The variables 'MYSQL_USER' and 'MYSQL_PASSWORD' are determined by the values returned after you create the ephemeral MySQL application, above.  

`oc new-app https://github.com/mohameddsheriff/mysql-openshift --context-dir=src/getCustomerSummaryList --name getcustomersummarylist -e MYSQL_HOST=mysql -e MYSQL_DATABASE=sampledb -e MYSQL_USER=userP1F -e MYSQL_PASSWORD=eRwTuVSW1MhsIUHw`  

## Create the service "mvccustomer"
This will pull a Linux image from a registry. This is being done to demonstrate the versatility of the OpenShift application build feature.

`oc new-app --name mvccustomer --docker-image=quay.io/donschenck/mvccustomer:latest -e GET_CUSTOMER_SUMMARY_LIST_URI="http://getcustomersummarylist:8080/customers" -e GET_CUSTOMER_URI="http://getcustomer:8080/customer"`

## Expose the mvccustomer web site
`oc expose service mvccustomer --insecure-skip-tls-verify=false`

## Test it
Get the route, then open it in your browser:  
`oc get routes`

# end here
### END ###
