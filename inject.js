if (typeof angular !== "undefined") {
  try {
    const loginData = angular
      .element(document.body)
      .injector()
      .get("SharedService")
      .getLoginDetails();
    const stuId = loginData.Student[0].StuID;
    const inId = loginData.InId

    // Create and dispatch a custom event carrying the Angular ID
    const event = new CustomEvent("AngularDataEvent", { detail: { stuId, inId } });
    document.dispatchEvent(event);
  } catch (err) {
    console.error("Error accessing Angular data:", err);
  }
}
