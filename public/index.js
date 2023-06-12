import { users } from "./users2.js";

// Select a random user, will be replaced by api in prod
let mainUser = users[Math.floor(Math.random() * users.length)];
function updateMainUser() {
  document.getElementById("main-user").textContent = mainUser.name;
}

const maxFollowers = Math.max(...users.map((user) => user.followersCount));

// Create an array of nodes with the main user and his followers
let nodes = [mainUser];
mainUser.followers.forEach((followerId) => {
  const follower = users.find((user) => user.id === followerId);
  if (follower) {
    const followedBack = mainUser.following.includes(followerId);
    nodes.push({ ...follower, followedBack });
  }
});

// Create an array of links between the main user and his followers
let links = mainUser.followers.map((followerId) => ({
  source: mainUser.id,
  target: followerId,
  followedBack: mainUser.following.includes(followerId),
}));

// Set up the D3 force simulation
const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody().strength(-100))
  .force(
    "center",
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  );

// Create SVG elements for the nodes and links
const svg = d3.select("svg");
let link = svg
  .append("g")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke", (d) => (d.followedBack ? "red" : "black"))
  .attr("stroke-width", (d) => Math.sqrt(d.value));

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "white")
  .style("color", "black")
  .style("border-radius", "4px")
  .style("padding", "4px 8px")
  .style("pointer-events", "none");

let node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.7)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", (d) =>
    d === mainUser ? 5 : (5 * d.followersCount) / maxFollowers
  )
  .attr("fill", (d) => (d === mainUser ? "red" : "black"))
  .attr("stroke", (d) => (d.is_verified ? "#1DA1F2" : "#fff")) // Add blue stroke for verified users
  .call(
    d3
      .drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
  )
  .on("mouseover", (event, d) => {
    const circle = d3.select(event.target);
    const [x, y] =
      circle.attr("cx") < window.innerWidth / 2
        ? [circle.attr("cx"), circle.attr("cy")]
        : [circle.attr("cx") - tooltip.node().offsetWidth, circle.attr("cy")];
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(d.name).style("left", `${x}px`).style("top", `${y}px`);
  })
  .on("mouseout", () => {
    tooltip.transition().duration(200).style("opacity", 0);
  })
  .on("click", (event, d) => {
    //console.log(d);
    if (d === mainUser) {
      //console.log(4);
      return; // Skip if already the main user
    }
    if (d !== mainUser) {
      // Simulate API call
      d3.selectAll("circle")
        .attr("pointer-events", "none") // Disable clic events during API call
        .attr("opacity", 0.3); // Visual indication of loading

      setTimeout(() => {
        mainUser = d;
        updateMainUser();
        updateGraph();
        // Enable clic events and reset opacity after a delay
        setTimeout(() => {
          d3.selectAll("circle")
            .attr("pointer-events", "auto") // Re-enable clic events
            .attr("opacity", 1); // Reset opacity
        }, 500); // Adjust the delay as needed
      }, 2000);
    }
  })
  .style("cursor", "pointer");

// Add zoom controls
svg.call(
  d3
    .zoom()
    .extent([
      [0, 0],
      [window.innerWidth, window.innerHeight],
    ])
    .scaleExtent([0.5, 8])
    .on("zoom", (event) => {
      const { transform } = event;
      node.attr("transform", transform);
      link.attr("transform", transform);
    })
);

// Run the simulation and update the positions of the nodes and links
simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});

function updateGraph() {
  nodes = [mainUser];
  mainUser.followers.forEach((followerId) => {
    const follower = users.find((user) => user.id === followerId);
    if (follower) {
      const followedBack = mainUser.following.includes(followerId);
      nodes.push({ ...follower, followedBack });
    }
  });

  links = mainUser.followers.map((followerId) => ({
    source: mainUser.id,
    target: followerId,
    followedBack: mainUser.following.includes(followerId),
  }));

  simulation.nodes(nodes);
  simulation.force("link").links(links);

  node = node.data(nodes, (d) => d.id);
  node.exit().remove();
  node = node
    .enter()
    .append("circle")
    .attr("r", (d) =>
      d === mainUser ? 5 : (5 * d.followersCount) / maxFollowers
    )
    .attr("fill", (d) => (d === mainUser ? "red" : "black"))
    .call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    )
    .on("mouseover", (event, d) => {
      const circle = d3.select(event.target);
      const [x, y] =
        circle.attr("cx") < window.innerWidth / 2
          ? [circle.attr("cx"), circle.attr("cy")]
          : [circle.attr("cx") - tooltip.node().offsetWidth, circle.attr("cy")];
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(d.name).style("left", `${x}px`).style("top", `${y}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    })
    .on("click", (event, d) => {
      if (d === mainUser) {
        //console.log(4);
        return; // Skip if already the main user
      }
      if (d !== mainUser) {
        // Simulate API call
        d3.selectAll("circle")
          .attr("pointer-events", "none") // Disable clic events during API call
          .attr("opacity", 0.3); // Visual indication of loading

        setTimeout(() => {
          mainUser = d;
          updateMainUser();
          updateGraph();
          // Enable clic events and reset opacity after a delay
          setTimeout(() => {
            d3.selectAll("circle")
              .attr("pointer-events", "auto") // Re-enable clic events
              .attr("opacity", 1); // Reset opacity
          }, 500); // Adjust the delay as needed
        }, 2000);
      }
    })
    .merge(node);

  // Get the selected colors from the settings popup
  const followerColor = d3.select("#followerLineColor").property("value");
  const followingColor = d3.select("#followingLineColor").property("value");

  // Update the link colors
  link.attr("stroke", (d) => (d.followedBack ? followingColor : followerColor));

  link = link.data(links, (d) => `${d.source.id}-${d.target.id}`);
  link.exit().remove();
  link = link
    .enter()
    .append("line")
    .attr("stroke-opacity", 0.6)
    .attr("stroke", (d) => (d.followedBack ? "red" : "black"))
    .attr("stroke-width", (d) => Math.sqrt(d.value))
    .merge(link);

  simulation.alpha(1).restart();
}

const gearIcon = d3.select(".gear-icon");
const settingsPopup = d3.select(".settings-popup");

gearIcon.on("click", () => {
  const popupVisible = settingsPopup.style("display") !== "none";
  settingsPopup.style("display", popupVisible ? "none" : "flex");

  // Event listener for follower color change
  const followerColorInput = d3
    .select("#followerLineColor")
    .attr("class", "color-input");
  followerColorInput.on("change", updateGraph);

  // Event listener for following color change
  const followingColorInput = d3
    .select("#followingLineColor")
    .attr("class", "color-input");
  followingColorInput.on("change", updateGraph);
});

settingsPopup.on("click", () => {
  settingsPopup.style("display", "flex");
});
updateMainUser();

//DAHSBOARD

const icon = document.getElementById("icon");
const table = document.getElementById("stats-table");

let isOpen = false;

icon.addEventListener("click", () => {
  isOpen = !isOpen;
  if (isOpen) {
    table.style.display = "block";
    table.classList.add("slideInUp");
  } else {
    table.classList.remove("slideInUp");
    table.classList.add("slideOutDown");
    setTimeout(() => {
      table.style.display = "none";
      table.classList.remove("slideOutDown");
    }, 500);
  }
  icon.classList.toggle("opened");
});
