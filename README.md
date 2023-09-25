<h1 align="center">
Research <br>
Narratives

[![Sitelink](https://img.shields.io/badge/Visit_Demo_Site-faebd7)](https://researchnarratives.netlify.app)
[![Documentation](https://img.shields.io/badge/Documentation-In_Progress-yellow)](https://github.com/rungdung/Research-Narratives/wiki)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2ee03dd3-d8b4-4332-91c6-d915d9278723/deploy-status)](https://app.netlify.com/sites/researchnarratives/deploys) 

</h1>

<div align="center">

A web app to augment data analysis, visualization and storytelling through **data-driven mindmaps**. This was designed to help _students, educators, journalists and researchers_ have a common whiteboard that _links data, writing and narrative visualization._

<br>

This _proof of concept_ has been developed as part of my internship at the [Urban Informatics Lab at IIHS, Bengaluru](https://iihs.co.in/urban-informatics-lab/)

</div>

<p float="left">

<img src="./assets/home-example-1.png" width="49%">
<img src="./assets/multiple-features-example-1.png" width="49%">

<img src="./assets/mindmap-example-1.png" width="99%">

<img src="./assets/spatial-connection-example-1.png" width="49%">
<img src="./assets/media-connection-example-1.png" width="49%">

</p>

## Alpha Demo

[Use the alpha demo here. ](https://researchnarratives.netlify.app/) (DESKTOP ONLY!)
This is a proof of concept and may not live up to production standards, use it with caution. Please report any bugs or issues that you find. Use the discussions tab to provide feedback or to start a discussion. There are no warranties provided.

## How do I use this in general?

```mermaid
graph TB
    subgraph Uploading data
        a(Upload data you want to annotate)-->b(Select features or filter collections \n you want to annotate and add to the Research map)
    end
    subgraph Writing your story
        b-->d(Start a narrative and write your story)-->e(Connect data from \nResearch Map to sections of your story)-->f(Share your data-story)
        e-->g(Share your annotations)
    end

```

## Components

### Resources

```mermaid
  graph LR;
      Resources-->Spatial;
      Spatial--> GeoJSONs
        Resources-->Non-spatial;
        Non-spatial-->PDFs
        Non-spatial-->Media
```

Resources can be any document that you want to annotate and link to your mind map. This can be spatial data, papers, news articles, media and so on. Spatial data is currently treated as first-class data and is the only data that can be annotated. PDFs and media can be annotated, but not spatially and neither on the interface. This is a work in progress. So is support for other spatial formats.

### What is a research map?

```mermaid
graph LR;
    a[Select a set of features]-->|Add to research map|R((ResearchMap));
    b[Filter a spatial data set]-->|Add to research map|R;
    c[Add text, images, media]-->|Add as second class citizens \n from within Research map|R;
```

A research map is the analogue of a mind map, but everything on it carries some annotated data. Once you upload Spatial data, you can select and/or filter a set of features and add them to the Research map.

You can link these features to other features, just like you would on a mind map. You can also add text, and images alongside these to the Research map.

### How do I create data stories?

```mermaid
graph TD
    subgraph Upload and collect data
    A(Upload all spatial datasets, \n filter and add as necessary to the research map) -->B(Collect all features and media \n on the research map)-->C(Start a narrative from the pen menu)
    end
    subgraph Start a narrative
    C-->D(Fill in title and subtitle)-->E(Add a section to the data story)-->F(Connect data from other nodes to this sections \n ie: Spatial or Image)
    end
```

Once you have annotated and built a web of your narrative, you can start a narrative from the Pen menu. Each narrative section contains text, any media and other spatial data that you want to display alongside it.
You can

- Add a title to the narrative section
- Add text to the narrative section
- Add media to the narrative section
- Add spatial data to the narrative section

### How is non-spatial data annotated?

PDF and AV media annotation on the interface is not yet supported. Media can be annotated through the notes field. Pertinent annotations can be displayed in the Narrative section as required for the time being.

### How do I share what I have created?

```mermaid
graph TB
    subgraph Sharing your research map
    A(Uploaded data)
    B(Research map with annotations)
    end
    subgraph Sharing your data-story
    C(Rendered story)
    D(Option to see data story and research map)
    end

```

Your research map is shareable, and so is your data story.
Your research map will contain all the data that you have uploaded, and the annotations that you have made.

# Technical FAQ

## Roadmap and status

- [x] Spatial data annotation
- [ ] Non-spatial data annotation
- [x] Datastory creation
- [x] Datastory sharing
- [ ] Datastory export
- [ ] Communities
- [ ] User profiles
- [ ] Sharing permissions
- [ ] Datastory commenting

## How do I contribute?

Please create a discussion thread or email at adhavan[dot]sivaraj16+RN[at]gmail[dot]com with Research Narratives as subject if you would like to contribute.

## How do I run this locally?

```
    git clone https://github.com/rungdung/Research-Narratives.git
    npm install --force
    npm run dev
```

## How do I deploy this?

- Set up a Supabase project and API keys
- Set up a MapTiler account and API keys

# License

This project is licensed under the Apache License 2.0 - see the [LICENSE.txt](LICENSE.txt) and [NOTICE.txt](NOTICE.txt) file for details.
