---
title: "Tutorial 2: ACF Lab 3 - Introduction to Amazon EC2"
tags: 
- COS20019/Tutorials
- Marked-off
---

This lab provides you with a basic overview of launching, resizing, managing, and monitoring an Amazon EC2 instance.

After completing this lab, you should be able to do the following:
- Launch a web server with termination protection enabled
- Monitor Your EC2 instance
- Modify the security group that your web server is using to allow HTTP access
- Resize your Amazon EC2 instance to scale
- Explore EC2 limits
- Test termination protection
- Terminate your EC2 instance

![[../resources/tute2.png|400]]
## Instruction
### Task 1: Launch Your Amazon EC2 Instance

>[!info] In this task, you will launch an Amazon EC2 instance with *termination protection*. Termination protection prevents you from accidentally terminating an EC2 instance. You will deploy your instance with a User Data script that will allow you to deploy a simple web server.

>[!example]-  Step 0: Access **EC2** Service
>
>1. In the **AWS Management Console** choose **Services**, choose **Compute** and then choose **EC2**.
>>**Note**: Verify that your EC2 console is currently managing resources in the **N. Virginia** (us-east-1) region.
>2. Choose the Launch instance  menu and select **Launch instance**.

>[!example]- Step 1: Name and tags
>
>1. Give the instance the name `Web Server`.
>>The Name you give this instance will be stored as a tag. Tags enable you to categorize your AWS resources in different ways. This is useful when you have many resources of the same type — you can quickly identify a specific resource based on the tags you have assigned to it.

>[!example]- Step 2: Application and OS Images (Amazon Machine Image)
>
>1. In the list of available *Quick Start* AMIs, keep the default **Amazon Linux** AMI selected.
>2. Also keep the default **Amazon Linux 2023 AMI** selected.
>>An **Amazon Machine Image (AMI)** provides the information required to launch an instance, which is a virtual server in the cloud. An AMI includes:
>>- A template for the root volume for the instance (for example, an operating system or an application server with applications)
>>- Launch permissions that control which AWS accounts can use the AMI to launch instances
>>- A block device mapping that specifies the volumes to attach to the instance when it is launched

>[!example]- Step 3: Instance type
>
>1. In the *Instance type* panel, keep the default **t2.micro** selected.
>>Amazon EC2 provides a wide selection of *instance types* optimized to fit different use cases. Instance types comprise varying combinations of CPU, memory, storage, and networking capacity and give you the flexibility to choose the appropriate mix of resources for your applications. Each instance type includes one or more *instance sizes*, allowing you to scale your resources to the requirements of your target workload.
>>
>>The t2.micro instance type has 1 virtual CPU and 1 GiB of memory.

>[!example]- Step 4: Key pair(log in)
>
>1. For **Key pair name - *required***, choose **vockey**.
>>Amazon EC2 uses public–key cryptography to encrypt and decrypt login information. To ensure you will be able to log in to the guest OS of the instance you create, you identify an existing key pair or create a new key pair when launching the instance. Amazon EC2 then installs the key on the guest OS when the instance is launched. That way, when you attempt to login to the instance and you provide the private key, you will be authorized to connect to the instance.

>[!example]- Step 5: Network settings
>
>1. Next to Network settings, choose **Edit**.
>2. For **VPC**, select **Lab VPC**.
>>The Lab VPC was created using an AWS CloudFormation template during the setup process of your lab. This VPC includes two public subnets in two different Availability Zones.
>>
>>**Note**: Keep the default subnet.
>3. Under **Firewall (security groups)**, choose **Create security group** and configure:
>>- **Security group name:** `Web Server security group`
>>- **Description:** `Security group for my web server`
>>>A *security group* acts as a virtual firewall that controls the traffic for one or more instances. When you launch an instance, you associate one or more security groups with the instance. You add *rules* to each security group that allow traffic to or from its associated instances.
>>- Under **Inbound security group rules**, notice that one rule exists. **Remove** this rule.

>[!example]- Step 6: Configure storage
>
>1. In the *Configure storage* section, keep the default settings.
>>Amazon EC2 stores data on a network-attached virtual disk called *Elastic Block Store*.

>[!example]- Step 7: Advanced details
>
>1. Expand **Advanced details**.
>2. For **Termination protection**, select **Enable**.
>>When an Amazon EC2 instance is no longer required, it can be *terminated*, which means that the instance is deleted and its resources are released. A terminated instance cannot be accessed again and the data that was on it cannot be recovered. If you want to prevent the instance from being accidentally terminated, you can enable *termination protection* for the instance, which prevents it from being terminated as long as this setting remains enabled.
>3. Scroll to the bottom of the page and then copy and paste the code shown below into the **User data** box:
><pre>#!/bin/bash<br>dnf install -y httpd<br>systemctl enable httpd<br>systemctl start httpd<br>echo '&lt;html>&lt;h1>Hello From Your Web Server!&lt;/h1>&lt;/html>' > /var/www/html/index.html</pre>
>>
>>When you launch an instance, you can pass *user data* to the instance that can be used to perform automated installation and configuration tasks after the instance starts.
>>
>>Your instance is running Amazon Linux 2023. The *shell script* you have specified will run as the *root* guest OS user when the instance starts. The script will:
>>- Install an Apache web server (httpd)
>>- Configure the web server to automatically start on boot
>>- Run the Web server once it has finished installing
>>- Create a simple web page

>[!example]- Step 8: Launch the instance
>
>1. At the bottom of the **Summary** panel on the right side of the screen choose Launch instance
> You will see a Success message.
>2. Choose View all instances
>-  In the Instances list, select 🟦**Web Server**.
>- Review the information displayed in the **Details** tab. It includes information about the instance type, security settings and network settings.
>>The instance is assigned a *Public IPv4 DNS* that you can use to contact the instance from the Internet.
>3. Wait for your instance to display the following:
>>- **Instance State:** *Running* 
>>- **Status Checks:** *2/2 checks passed*


### Task 2: Monitor Your Instance

>[!info] Monitoring is an important part of maintaining the reliability, availability, and performance of your Amazon Elastic Compute Cloud (Amazon EC2) instances and your AWS solutions.

>[!example]- Step 1: Choose the **Status checks** tab
>
>With instance status monitoring, you can quickly determine whether Amazon EC2 has detected any problems that might prevent your instances from running applications. Amazon EC2 performs automated checks on every running EC2 instance to identify hardware and software issues.
>
>Notice that both the **System reachability** and **Instance reachability** checks have passed.

>[!example]- Step 2: Choose the **Monitoring** tab
>
>This tab displays Amazon CloudWatch metrics for your instance. Currently, there are not many metrics to display because the instance was recently launched.
>
>>[!note] Amazon EC2 sends metrics to Amazon CloudWatch for your EC2 instances. Basic (five-minute) monitoring is enabled by default. You can also enable detailed (one-minute) monitoring.

>[!example]- Step 3: In the Actions menu towards the top of the console, select **Monitor and troubleshoot** > **Get system log**
>
>The System Log displays the console output of the instance, which is a valuable tool for problem diagnosis. It is especially useful for troubleshooting kernel problems and service configuration issues that could cause an instance to terminate or become unreachable before its SSH daemon can be started. If you do not see a system log, wait a few minutes and then try again.

>[!example]- Step 4: Scroll through the output and note that the HTTP package was installed from the **user data** that you added when you created the instance
>
>![[../resources/tute2-t2-s4.png]]

>[!example] Step 5: Choose **Cancel**

>[!example]- Step 6: Ensure **Web Server** is still selected. Then, in the Actions menu, select **Monitor and troubleshoot** **Get instance screenshot**
>
>This shows you what your Amazon EC2 instance console would look like if a screen were attached to it.
>
>![[../resources/tute2-t2-s6.png]]

>[!example] Step 7: Choose **Cancel**

### Task 3: Update Your Security Group and Access the Web Server

>[!info] When you launched the EC2 instance, you provided a script that installed a web server and created a simple web page. In this task, you will access content from the web server.

>[!example] Step 1: Ensure **Web Server** is still selected. Choose the **Details** tab.

>[!example] Step 2: Copy the **Public IPv4 address** of your instance to your clipboard.

>[!example]- Step 3: Open a new tab in your web browser, paste the IP address you just copied, then press **Enter**.
>
>>[!question]- Are you able to access your web server? Why not?
>>
>>You are **not** currently able to access your web server because the *security group* is not permitting inbound traffic on port 80, which is used for HTTP web requests. This is a demonstration of using a security group as a firewall to restrict the network traffic that is allowed in and out of an instance.
>>
>>To correct this, you will now update the security group to permit web traffic on port 80.

>[!example] Step 4: Keep the browser tab open, but return to the **EC2 Console** tab.

>[!example] Step 5: In the left navigation pane, choose **Security Groups**.

>[!example] Step 6: Select 🟦**Web Server security group**.

>[!example]- Step 7: Choose the **Inbound rules** tab.
>
>The security group currently has no inbound rules.

>[!example]- Step 8: Choose Edit inbound rules, select Add rule and then configure
>
>>- **Type:** *HTTP*  
>>- **Source:** *Anywhere-IPv4*
>>- Choose Save rules

>[!example]- Step 9: Return to the web server tab that you previously opened and refresh  the page.
>
>You should see the message *Hello From Your Web Server!*

### Task 4: Resize Your Instance: Instance Type and EBS Volume

>[!info] As your needs change, you might find that your instance is over-utilized (too small) or under-utilized (too large). If so, you can change the *instance type*. For example, if a *t2.micro* instance is too small for its workload, you can change it to an *m5.medium* instance. Similarly, you can change the size of a disk.

>[!example]- Step 1: Stop Your Instance
>
>Before you can resize an instance, you must *stop* it.
>>When you stop an instance, it is shut down. There is no runtime charge for a stopped EC2 instance, but the storage charge for attached Amazon EBS volumes remains.
>1. On the **EC2 Management Console**, in the left navigation pane, choose **Instances**.
>🟦 **Web Server** should already be selected.
>2. In the Instance State  menu, select **Stop instance**.
>3. Choose Stop - Your instance will perform a normal shutdown and then will stop running.
>4. Wait for the **Instance state** to display: *Stopped*.

>[!example]- Step 2: Change The Instance Type
>
>In the Actions menu, select **Instance settings** **Change instance type**, then configure:
>- **Instance Type:** *t2.small* 
>- Choose Apply
>When the instance is started again it will run as a *t2.small*, which has twice as much memory as a *t2.micro* instance.

>[!example]- Step 3: Resize the EBS Volume
>
>1. With the Web Server instance still selected, choose the **Storage** tab, select the name of the Volume ID, then select the checkbox next to the volume that displays.
>2. In the Actions menu, select **Modify volume**.
>The disk volume currently has a size of 8 GiB. You will now increase the size of this disk.
>3. Change the size to: `10`
>4. Choose Modify
>5. Choose Modify again to confirm and increase the size of the volume.

>[!example]- Step 4: Start the Resized Instance
>
>You will now start the instance again, which will now have more memory and more disk space.
>1. In left navigation pane, choose **Instances**.
>2. Select the **Web Server** instance.
>3. In the Instance state menu, select **Start instance**.

### Task 5: Explore EC2 Limits

>[!info] Amazon EC2 provides different resources that you can use. These resources include images, instances, volumes, and snapshots. When you create an AWS account, there are default limits on these resources on a per-region basis.

>[!example] Step 1: In the AWS Management Console, in the search box next to **Services**, search for and choose `Service Quotas`

>[!example] Step 2: Choose **AWS services** from the navigation menu and then in the AWS services *Find services* search bar, search for `ec2` and choose **Amazon Elastic Compute Cloud (Amazon EC2)**

>[!example]- Step 3: In the *Find quotas* search bar, search for `running on-demand`, but do not make a selection. Instead, observe the filtered list of service quotas that match the criteria
>
>Notice that there are limits on the number and types of instances that can run in a region. When launching instances, the request must not cause your usage to exceed the instance limits currently defined in that region.
>
>You can request an increase for many of these limits.

### Task 6: Test Termination Protection

>[!info] You can delete your instance when you no longer need it. This is referred to as *terminating* your instance. You cannot connect to or restart an instance after it has been terminated. In this task, you will learn how to use *termination protection*.

>[!example] Step 1: In the AWS Management Console, in the search box next to **Services**, search for and choose `EC2` to return to the EC2 console.

>[!example] Step 2: In left navigation pane, choose **Instances**.

>[!example] Step 3: Select the **Web Server** instance and in the Instance state menu, select **Terminate instance**.

>[!example]- Step 4: Then choose Terminate
>
>Note that there is a message that says: *Failed to terminate the instance i-1234567xxx. The instance 'i-1234567xxx' may not be terminated. Modify its 'disableApiTermination' instance attribute and try again.*
>
>This is a safeguard to prevent the accidental termination of an instance. If you really want to terminate the instance, you will need to disable the termination protection.

>[!example] Step 5: In the Actions menu, select **Instance settings** > **Change termination protection**

>[!example] Step 6: Remove the check next to **Enable**

>[!example]- Step 7: Choose Save
>
>You can now terminate the instance.

>[!example] Step 8: Select the **Web Server** instance again and in the Instance state menu, select **Terminate instance**

>[!example] Step 9: Choose Terminate

## For In-class only

>[!important] Access [CollaborateUltra session](https://au.bbcollab.com/guest/a9aa68f8819944b0b5bcb9ad39e25e71)

>[!important] For in-class demo sign-up with [Slido](https://app.sli.do/event/8S3mAHQWfxa7tf5QWNb6vY)