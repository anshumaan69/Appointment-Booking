import connectDB from "@/utils/dbconfig";
import Service from "@/models/service";
import { NextResponse } from "next/server";

// GET - Get a specific service by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update a service
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { name, description, duration, price } = body;
    
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, duration, price },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Delete a service
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const deletedService = await Service.findByIdAndDelete(id);
    
    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
