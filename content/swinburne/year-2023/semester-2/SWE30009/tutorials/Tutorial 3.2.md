---
title: "Tutorial 3.2: ACA Module 11 Guided Lab - Streaming Dynamic Content using Amazon CloudFront"
tags: 
- COS20019/Tutorials
- Tutorial_3
- Marked-off
---

In this lab, you will use Amazon CloudFront to deliver a dynamic, multiple bit-rate stream to a connected device using Apple’s HTTP Live Streaming (HLS) protocol. The stream can be played on any browser that supports the HLS protocol. In this lab, you will also use Amazon Elastic Transcoder to convert a source video into multiple bit-rates that will be delivered using CloudFront.

After completing this lab, you should be able to:

- Create multiple bit-rate versions of a given source media file using Amazon Elastic Transcoder. 
- Use Amazon CloudFront to deliver the dynamic (multi bit-rate) stream created by Amazon Elastic Transcoder.

At the **end** of this lab, your architecture will look like the following example:

![[../resources/tute3.2-architecture.png]]
## Instruction

### Task 1: Lab Preparation

>[!info] In this lab, you will be using a sample video file to configure a dynamic stream. For your convenience, an Amazon Simple Storage Service (Amazon S3) bucket has already been created.

>[!example]- Step 1: In the AWS Management Console, on the **Services** menu, choose **S3**
>
>An S3 bucket containing the string _**awstrainingreinvent**_ should be present. Note the Region that the bucket is in, and open the bucket.

>[!example]- Step 2: Open the **input** folder. It contains a video file named **AmazonS3Sample.mp4**
>
>>[!note] Note
>> From the time you log in to the Amazon S3 console, it can take up to ten minutes for the file to appear in the S3 bucket. If you do not see it, select the circular arrow icon on the upper right of the screen to refresh the contents of the bucket.

### Task 2: Create an Amazon CloudFront Distribution

>[!info] In this task, you will create an Amazon CloudFront distribution that will be used to deliver the multiple bit-rate files generated by Amazon Elastic Transcoder to end-user devices.

>[!example] Step 1: On the **Services** menu, choose **CloudFront**

>[!example] Step 2: Choose **Create a CloudFront distribution**

>[!example]- Step 3: Under **Origin Settings** section of the page, enter the follow information
> - Select the **Origin domain** field. A list of S3 buckets will appear. Choose the one that was created earlier that has **awstrainingreinvent** as part of the file name.
>- Leave **Origin access** as **Public**.
>- Under **Web Application Firewall (WAF)** select **Do not enable security protections**.
>
>The warning message under **Custom SSL certificate - optional** can be safely ignored.

>[!example] Step4: Scroll to the bottom of the page, then choose **Create Distribution**

### Task 3: Create an Amazon Elastic Transcoder Pipeline

#### Create a Pipeline

>[!info] In this section, you will create a pipeline that will manage the jobs to transcode the input file.

>[!example] Step 1: In the AWS Management Console, on the **Services** menu, choose **Elastic Transcoder**

>[!example] Step 2: In the navigation bar of the Amazon Elastic Transcoder console, select the same Region that the S3 bucket was created in

>[!example] Step 3: On the Pipelines page, choose **Create a new Pipeline**

>[!example] Step 4: For **Pipeline Name**, enter `InputPipeline`

>[!example] Step 5: For **Input Bucket**, select the **awstrainingreinvent** S3 bucket

>[!example]- Step 6: For **IAM Role**, under **Other roles**, select **AmazonElasticTranscoderRole** 
>
>This is a role that was pre-created in this lab's CloudFormation template that uses the managed policy AmazonElasticTranscoderRole. The Elastic Transcoder service will assume this role to access Amazon S3 and Amazon Simple Notification Service (Amazon SNS) resources in your lab account.

>[!example]- Step 7: In the **Configuration for Amazon S3 Bucket for Transcoded Files and Playlists** section, enter the follow information
>
>- Under **Bucket**, select the **awstrainingreinvent** S3 bucket.
>- Under **Storage Class**, select **Standard**.

>[!example]- Step 8: In the **Configuration for Amazon S3 Bucket for Thumbnails** section, enter the following information
>
>- Under **Bucket**, select the **awstrainingreinvent** S3 bucket.
>- Under **Storage Class**, select **ReducedRedundancy**.

>[!example] Step 9: Choose **Create Pipeline**

#### Create a Job

>[!info] In this section, you will create a job under the Amazon Elastic Transcoder pipeline that was just created. The job does the work of transcoding the input file into multiple bit-rates as selected.

>[!example]- Step 1: On the Pipelines page, choose **Create New Job** to create a transcoding job
>
> You create the job in the pipeline (queue) that you want to use to transcode the video file.

>[!example] Step 2: For **Pipeline**, select **InputPipeline**

>[!example]- Step 3: For **Output Key Prefix**, enter `output/`
>
>Amazon Elastic Transcoder will prepend this value to the names of all files that the job will create (including output files, thumbnails, and playlists).

>[!example] Step 4: For **Input Key**, select the input file labeled **input/AmazonS3Sample.mp4**
#### Configure Output Details

>[!info] The settings in this section will determine how many output files (bit-rates) are created. You will configure three output files for this demo having three separate bit-rates (2Mbps, 1.5Mbps and 1Mbps). Each output bit-rate will require you to create a separate output details section. This will also output a playlist file for each bit-rate, which lists all the segments that make up the stream.

>[!example] Step 1: For **Preset:**, select **System preset: HLS 2M**

>[!example] Step 2: For **Segment Duration**, enter `10` (which is the HLS default)

>[!example] Step 3: For **Output Key**, enter the unique prefix `HLS20M` to name the segments created using this preset

>[!example]- Step 4: Click **+ Add Another Output** and repeat the steps above to generate segments for presets **HLS 1.5M** and **HLS 1M** and then provide the respective prefix names
> - `HLS15M`
>- `HLS10M`

>[!caution] Caution 
>
>Do not create the job yet! Instead, complete the next few steps in this lab which will have you add a playlist to the job.

#### Configure a Playlist

>[!info] The playlist will combine all the individual bit-rate playlists and provide a single URL for the devices to playback the stream. To configure a playlist, do the following:

>[!example]- Step 1: Under **Playlists (Adaptive Streaming)**, choose **Add Playlist**, then configure
>
>  - **Master Playlist Name** `primary`
>  - **Playlist Format:** *HLSv3*

>[!example]- Step 2: Select all the three outputs, which were entered in the previous section, to include them in this playlist by selecting the **+** option

>[!example]- Step 3: Choose **Create New Job**
>
>The transcoding process should complete within a minute.

### Task 4: Test Playback of the Dynamic (Multi Bit-Rate) Stream

>[!info] In this module, you will test the playback of the dynamic stream generated in the previous section using an iOS or Android device. You can also use an Android 4.x device to test the below exercise.

>[!note] Note 
>
>Certain browsers may not support this feature. Use the default web browser in the device to test.
#### Construct the Playback URL

The playback URL that plays through Amazon CloudFront is comprised of two components:
- Amazon CloudFront domain name
- Path of the playlist file in the S3 bucket (output generated by Elastic Transcoder):
	`http://<CloudFront domain name>/<playlist file path in Amazon S3 bucket>`
#### Obtain an Amazon CloudFront Domain Name

To obtain an Amazon CloudFront domain name:

>[!example] Step 1: In the AWS Management Console, on the **Services** menu, choose **CloudFront**

>[!example] Step 2: Select the **Amazon CloudFront** distribution that was previously created, and verify that the **Status** has changed from *InProgress* to Enabled

>[!example] Step 3: Only after the **Status** changes to *Enabled*, select the Distribution and under **Settings**. Copy the **Distribution domain name** and paste it into a text editor
### Obtain the Playlist File Path

To obtain the playlist file path:

>[!example] Step 1: On the **Services** menu, choose **S3**

>[!example] Step 2: Select the **awstrainingreinvent** S3 bucket

>[!example]- Step 3: Open the **output** folder (which contains the output of the transcoding job) and select the **primary.m3u8** playlist file
>
>This is the file that you will play on your mobile device.
>
>Next, you must create the URL to the file from CloudFront.

>[!example]- Step 4: In a text editor, construct the URL by appending `/output/primary.m3u8` to the end of your CloudFront domain name
>
>The new URL should look similar to: *d1ckwesahkbyvu.cloudfront.net/output/primary.m3u8*

>[!example]- Step 5: Type the URL into the default browser of an iOS or Android device 
>
>If you do not have a mobile device available, type the URL into a browser on your computer.
>>[!warning] Be aware that standard data rates may apply when playing the video on a mobile device.
>
>The stream should start playing on your device and dynamically request the relevant segments based on your bandwidth and CPU conditions.

>[!success]- You have learned how to use AWS services such as Amazon S3, Amazon Elastic Transcoder, and Amazon CloudFront together to deliver HLS media files to iOS or Android devices
> 
> You have successfully:
> - Learned the basic concepts and terminology of the Amazon Elastic Transcoder and Amazon CloudFront services.
> - Created your own Amazon Elastic Transcoder pipeline and Amazon CloudFront distribution.
> - Used Amazon Elastic Transcoder to transcode a video file into different HLS formats and distributed it to remote devices using Amazon CloudFront.

## For In-class only

>[!important] Access [CollaborateUltra session](https://au.bbcollab.com/guest/a9aa68f8819944b0b5bcb9ad39e25e71)

>[!important] For in-class demo sign-up with [Slido](https://app.sli.do/event/buT4Wwji1gUasFjY59TEJn)
