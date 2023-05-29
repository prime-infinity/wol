import { users } from "./users2.js";
console.log(users);
// Select a random user, will be replaced by api in prod
const mainUser = users[Math.floor(Math.random() * users.length)];
//console.log(mainUser);
const maxFollowers = Math.max(...users.map((user) => user.followersCount));

console.log(maxFollowers);
// Create an array of nodes with the main user and his followers
const nodes = [mainUser];
mainUser.followers.forEach((followerId) => {
  const follower = users.find((user) => user.id === followerId);
  if (follower) {
    const followedBack = mainUser.following.includes(followerId);
    nodes.push({ ...follower, followedBack });
  }
});

// Create an array of links between the main user and his followers
const links = mainUser.followers.map((followerId) => ({
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
const link = svg
  .append("g")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke", (d) => (d.followedBack ? "red" : "black"))
  .attr("stroke-width", (d) => Math.sqrt(d.value));
const node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
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
  );

//label
/*const label = svg
  .append("g")
  .attr("class", "labels")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("class", "label")
  .text((d) => d.name)
  .attr("x", (d) => d.x + 10) // Adjust the label position as needed
  .attr("y", (d) => d.y - 10) // Adjust the label position as needed
  .attr("font-size", "8px") // Adjust the font size as needed
  .attr("fill", "#000"); // Adjust the font color as needed
*/

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
      //label.attr("transform", transform); // Apply zoom to labels
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
  //the label below
  /*label
    .attr("x", (d) => d.x + 5) // Adjust the label position as needed
    .attr("y", (d) => d.y - 5); // Adjust the label position as needed
    */
});
