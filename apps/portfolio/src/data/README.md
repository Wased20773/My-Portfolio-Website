---
title: README

last-verified: 2026-10-18
status: draft
---

# Data

## What is this for?

The data in this folder is a temporary dataset built to mock a JSON response from an API requested from a CMS. It helps gets the general skeleton down and speeds up production without increasing cost. With this implementation CMS API integration becomes seamless and easier to plug in without worrying about migration.

## What type of data?

The data will be coming from a pre-generated response from Sanity's "Vision" results. The results are saved in JSON and pasted into the applications data. While not all CMS's include the same results, it will be easier to migrate and speeds up developement without needed to write every line of code manually with there UUID's and complex datasets.

## How Im query the data?

Its long but it gets the data I want in the formate I need so that I can render it easily on the frontend:

\*[_type == "directory"] {
"cwd": select(
name == "~" => "~/",
parent->name == "~" => "~/" + name + "/",
parent->parent->name == "~" =>
"~/" + parent->name + "/" + name + "/"
),

"files": select(

    // $HOME
    name == "~" => [
      ...*[_type == "aboutMe"] {
        _id,
        _type,
        body,
        gallery,
        name,
        what,
        when,
        where,
        who,
        why
      },

      ...*[_type == "script"] {
        _id,
        _type,
        name
      }
    ],

    // ~/newsletter/
    name == "newsletter" =>
      *[_type == "post"] {
        _id,
        _type,
        body,
        coverImage,
        "name": slug.current + "." + extension,
        publishedAt,
        shortDescription,
        title
      },

    // ~/projects/
    name == "projects" =>
      *[_type == "project"] {
        _id,
        _type,
        description,
        endDate,
        isOngoing,
        "name": slug.current + "." + extension,
        startDate,
        tech,
        title
      },

    // every other folder
    []

),

"folders": \*[
_type == "directory" &&
parent->name == ^.name
] {
"cwd": select(
name == "~" => "~/",
parent->name == "~" => "~/" + name + "/",
parent->parent->name == "~" =>
"~/" + parent->name + "/" + name + "/"
),
name
},

name,

"parent": select(
name == "~" => null,
parent->name == "~" => "~/",
parent->parent->name == "~" =>
"~/" + parent->name + "/"
)
}
